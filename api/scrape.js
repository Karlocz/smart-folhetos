// /api/scrape.js
const scrapeAssai = require('../scrapers/assaiScraper');

module.exports = async (req, res) => {
  try {
    const products = await scrapeAssai();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar a raspagem' });
  }
};
