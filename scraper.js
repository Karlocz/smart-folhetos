const puppeteer = require('puppeteer');

async function scrapeAssai() {
    // Inicia o navegador
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Acessa o site do Assaí Hortolândia
    await page.goto('https://www.assai.com.br/ofertas');

    // Espera até que a página carregue completamente
    await page.waitForSelector('.slick-track');  // Espera o slider carregar (ou outro elemento da página)

    // Coleta os dados dos produtos
    const products = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.slick-slide'));  // Seleciona todos os produtos na página
        return items.map(item => {
            const name = item.querySelector('.product-card-title') ? item.querySelector('.product-card-title').innerText : '';
            const price = item.querySelector('.product-card-price') ? item.querySelector('.product-card-price').innerText : '';
            return { name, price };
        });
    });

    // Fecha o navegador
    await browser.close();

    // Retorna os produtos coletados
    return products;
}

// Chama a função e exibe os resultados no console
scrapeAssai().then(products => {
    console.log(products);
}).catch(error => {
    console.error("Erro ao buscar ofertas:", error);
});
