#!/usr/bin/env node

const process = require('process');
const url = require('url');
const argv = require('yargs').argv;
const puppeteer = require('puppeteer');

const siteAddress = argv._[0];
if (!siteAddress) {
  console.log("Usage: ./shot.js <url> [-o shot.png] [-c 'COOKIE:VALUE'] [-w <width>] [-h <height>] [--interactive]");
  process.exit(1);
}

const options = {
  interactive: !argv.interactive,
  width: argv.w || 800,
  height: argv.h || 600,
  cookie: argv.c || '',
  outputFile: argv.o || 'shot.png',
  delay: 3000
};

(async () => {
  const browser = await puppeteer.launch({
    headless: options.interactive,
    ignoreHTTPSErrors: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: options.width, height: options.height });
  if (options.cookie) {
    const cookieName = options.cookie.split(':')[0];
    const cookieValue = options.cookie.split(':')[1];
    await page.setCookie({ name: cookieName, value: cookieValue, domain: url.parse(siteAddress).host });
  }
  await page.goto(siteAddress);
  await page.waitFor(options.delay);
  await page.screenshot({ path: options.outputFile });
  await browser.close();
  console.log("Screenshot has been saved to " + options.outputFile);
})();
