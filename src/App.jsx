import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import './App.css';

// Configura worker do pdfjs-dist via CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Conexão com Supabase
const supabase = createClient(
  'https://ongdxywgxszpxopxqfyq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZ2R4eXdneHN6cHhvcHhxZnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzQ5OTYsImV4cCI6MjA2MTM1MDk5Nn0.Z3utIhlvB4lbb3GghbwDiLno8EEmLqcthVhxiguI70c'
);

function App() {
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([]);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  // Lista arquivos na pasta 'upload' do bucket 'folhetos'
  const fetchDocs = async () => {
    const { data, error } = await supabase.storage
      .from('folhetos')
      .list('upload', { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } });

    if (error) {
      console.error('Erro ao listar arquivos:', error.message);
      return;
    }

    const arquivos = data
      .filter(item => item.metadata && item.metadata.size > 0)
      .map(item => ({ name: item.name, path: `upload/${item.name}` }));

    setDocs(arquivos);
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
    setOcrText('');
  };

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return alert('Selecione um arquivo.');

    const path = `upload/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('folhetos')
      .upload(path, file, { upsert: true });

    if (error) {
      console.error('Erro no upload:', error.message);
      alert('Falha no envio do arquivo.');
    } else {
      alert('Arquivo enviado com sucesso!');
      setFile(null);
      fetchDocs();
    }
  };

  const handleOCR = async path => {
    setLoading(true);
    setOcrText('');

    try {
      // Obtem URL pública do PDF
      const { data: { publicUrl } } = supabase.storage.from('folhetos').getPublicUrl(path);
      // Busca o PDF como arrayBuffer
      const res = await fetch(publicUrl);
      const arrayBuffer = await res.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      // Inicializa worker do Tesseract
      const worker = createWorker({ logger: m => console.log(m) });
      await worker.load();
      await worker.loadLanguage('por');
      await worker.initialize('por');

      let fullText = '';
      // Processa cada página
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
        // ADICIONA canvas ao DOM para debug visual
        document.body.appendChild(canvas);

        const imgData = canvas.toDataURL('image/png');
        const { data: { text } } = await worker.recognize(imgData);
        fullText += text + '\n';
      }

      await worker.terminate();
      setOcrText(fullText);
    } catch (error) {
      console.error('Falha ao processar OCR:', error);
      alert('Falha ao processar OCR.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Smart Folhetos</h1>

      <div className="upload-container">
        <h2>Envie seu PDF</h2>
        <form onSubmit={handleUpload} className="upload-form">
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="file-input" />
          <button type="submit" className="submit-btn">Upload</button>
        </form>
      </div>

      <div className="files-container">
        <h2>Folhetos Disponíveis</h2>
        <ul className="folhetos-list">
          {docs.length > 0 ? docs.map((doc, idx) => (
            <li key={idx}>
              {doc.name}
              <button onClick={() => handleOCR(doc.path)} className="submit-btn" style={{ marginLeft: '10px' }}>
                {loading ? 'Processando...' : 'Fazer OCR'}
              </button>
            </li>
          )) : <li>Nenhum folheto encontrado.</li>}
        </ul>
      </div>

      {ocrText && (
        <div className="ocr-result">
          <h2>Resultado OCR</h2>
          <pre>{ocrText}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
