// /scrapers/assaiScraper.js
const puppeteer = require('puppeteer');

async function scrapeAssai() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.assai.com.br/ofertas');
    await page.waitForSelector('.slick-track');  // Espera o slider carregar

    // Verificando se conseguimos capturar os dados da página
    console.log('A página foi carregada, iniciando a raspagem.');

    const products = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.product-card'));
        
        // Verificando a quantidade de produtos capturados
        console.log(`Produtos encontrados: ${items.length}`);
        
        return items.map(item => {
            const name = item.querySelector('.product-card-title') ? item.querySelector('.product-card-title').innerText.trim() : 'Nome não encontrado';
            const price = item.querySelector('.product-card-price') ? item.querySelector('.product-card-price').innerText.trim() : 'Preço não encontrado';
            return { name, price };
        });
    });

    // Verificando os resultados antes de retornar
    console.log('Produtos raspados:', products);

    await browser.close();
    return products;
}

module.exports = scrapeAssai;
