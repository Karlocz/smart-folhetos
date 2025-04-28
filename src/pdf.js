import pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Função para processar OCR em um arquivo PDF
const handlePdfOcr = async (file) => {
  const pdfUrl = URL.createObjectURL(file);
  
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const numPages = pdf.numPages;
  
  let ocrText = "";

  for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const viewport = page.getViewport({ scale: 1 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    const imgData = canvas.toDataURL();

    // Passa a imagem para o Tesseract para reconhecimento de texto
    const { data: { text } } = await Tesseract.recognize(imgData, 'por', {
      logger: (m) => console.log(m),
    });

    ocrText += text + "\n";
  }

  return ocrText;
};

// Função que chama o OCR
const handleOcr = async (file) => {
  try {
    const ocrResult = await handlePdfOcr(file);
    setOcrResult(ocrResult);
  } catch (error) {
    console.error("Falha ao processar OCR", error);
    alert("Falha ao processar OCR");
  }
};
