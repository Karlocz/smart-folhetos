const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Configuração de onde os arquivos serão armazenados temporariamente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pasta onde os arquivos serão salvos temporariamente
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para cada arquivo
  }
});

const upload = multer({ storage: storage });

app.post('/upload-folheto', upload.single('file'), (req, res) => {
  // Arquivo salvo temporariamente em 'uploads'
  const filePath = req.file.path;

  // Você pode realizar a análise ou salvar o caminho do arquivo no banco de dados aqui
  console.log('Arquivo salvo para análise:', filePath);

  res.status(200).send({ message: 'Arquivo recebido para análise.', filePath });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
