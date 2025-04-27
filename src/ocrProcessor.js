import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imageFile) => {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'eng',
      { logger: m => console.log(m) }
    );
    return result.data.text;
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    return '';
  }
};

export const extractProductsFromText = (text) => {
  const productRegex = /([A-Za-z\s]+)\s+(\d+,\d{2})/g;
  let products = [];
  let match;

  while ((match = productRegex.exec(text)) !== null) {
    products.push({
      name: match[1].trim(),
      price: match[2].trim(),
    });
  }
  return products;
};

export const compareProducts = (products1, products2) => {
  let comparison = [];

  products1.forEach((p1) => {
    const match = products2.find(p2 => p2.name.toLowerCase() === p1.name.toLowerCase());
    if (match) {
      comparison.push({
        name: p1.name,
        price1: p1.price,
        price2: match.price,
        difference: (parseFloat(p1.price.replace(',', '.')) - parseFloat(match.price.replace(',', '.'))).toFixed(2)
      });
    }
  });

  return comparison;
};
