// /scrapers/assaiScraper.js
const puppeteer = require('puppeteer');

async function scrapeAssai() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.assai.com.br/ofertas');
    await page.waitForSelector('.slick-track');  // Espera o slider carregar

    const products = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.slick-slide'));
        return items.map(item => {
            const name = item.querySelector('.product-card-title') ? item.querySelector('.product-card-title').innerText : '';
            const price = item.querySelector('.product-card-price') ? item.querySelector('.product-card-price').innerText : '';
            return { name, price };
        });
    });

    await browser.close();
    return products;
}

module.exports = scrapeAssai;
