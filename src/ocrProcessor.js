import Tesseract from 'tesseract.js';

// Faz OCR a partir de uma URL da imagem
export async function extractTextFromImageUrl(imageUrl) {
  const { data: { text } } = await Tesseract.recognize(
    imageUrl,
    'por', // idioma português (pode ajustar se quiser)
    { logger: m => console.log(m) }
  );
  return text;
}

// Extrai produtos do texto capturado
export function extractProductsFromText(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const products = [];

  lines.forEach(line => {
    const match = line.match(/(.+?)\s+(\d+[.,]?\d*)$/); // Ex: "Arroz 12.99"
    if (match) {
      products.push({
        name: match[1],
        price: parseFloat(match[2].replace(',', '.'))
      });
    }
  });

  return products;
}

// Compara produtos entre os dois folhetos
export function compareProducts(products1, products2) {
  const comparison = [];

  products1.forEach(p1 => {
    const match = products2.find(p2 => p2.name.toLowerCase() === p1.name.toLowerCase());

    if (match) {
      comparison.push({
        name: p1.name,
        price1: p1.price,
        price2: match.price,
        cheaperAt: p1.price < match.price ? 'Folheto 1' : (p1.price > match.price ? 'Folheto 2' : 'Empate')
      });
    }
  });

  return comparison;
}
