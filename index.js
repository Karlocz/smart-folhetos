const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Tesseract = require('tesseract.js');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Rota de upload de folheto
app.post('/api/upload-folheto', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    // Usa Tesseract para extrair texto da imagem/pdf
    const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'por');

    // Simples processamento de texto (melhorar depois)
    const produtos = text.split('\n')
      .filter(line => /\d+,\d{2}/.test(line))
      .map(line => {
        const match = line.match(/(.+)\s(\d+,\d{2})/);
        if (match) {
          return {
            nome: match[1].trim(),
            preco: parseFloat(match[2].replace(',', '.'))
          };
        }
        return null;
      })
      .filter(item => item !== null);

    res.json({
      mercado: req.body.mercado || 'Desconhecido',
      produtos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar o folheto.' });
  }
});

// Outras rotas para buscar produto etc. podem vir aqui depois

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
