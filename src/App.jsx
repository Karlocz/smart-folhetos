import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';
import './App.css';

// Conexão com Supabase
const supabase = createClient(
  'https://ongdxywgxszpxopxqfyq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZ2R4eXdneHN6cHhvcHhxZnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzQ5OTYsImV4cCI6MjA2MTM1MDk5Nn0.Z3utIhlvB4lbb3GghbwDiLno8EEmLqcthVhxiguI70c'
);

function App() {
  const [file, setFile] = useState(null);
  const [folhetos, setFolhetos] = useState([]);
  const [selectedFolhetos, setSelectedFolhetos] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loadingOCR, setLoadingOCR] = useState(false);

  useEffect(() => {
    fetchFolhetos();
  }, []);

  const fetchFolhetos = async () => {
    const { data, error } = await supabase.storage.from('folhetos').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    });

    if (error) {
      console.error('Erro ao listar folhetos:', error);
    } else {
      setFolhetos(data);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      alert('Por favor, selecione um arquivo.');
      return;
    }

    const { data, error } = await supabase.storage
      .from('folhetos')
      .upload(`uploads/${Date.now()}_${file.name}`, file);

    if (error) {
      console.error('Erro no upload:', error);
      alert('Falha no envio do arquivo.');
    } else {
      alert('Arquivo enviado com sucesso!');
      setFile(null);
      fetchFolhetos();
    }
  };

  const handleSelectFolheto = (e, folhetoName) => {
    if (e.target.checked) {
      if (selectedFolhetos.length < 2) {
        setSelectedFolhetos([...selectedFolhetos, folhetoName]);
      }
    } else {
      setSelectedFolhetos(selectedFolhetos.filter((name) => name !== folhetoName));
    }
  };

  const compareFolhetos = async () => {
    if (selectedFolhetos.length !== 2) {
      alert('Selecione exatamente 2 folhetos para comparar.');
      return;
    }

    try {
      setLoadingOCR(true);

      const texts = [];
      for (const folhetoName of selectedFolhetos) {
        const { data } = supabase.storage.from('folhetos').getPublicUrl(folhetoName);
        const url = data.publicUrl;
        const text = await extractTextFromPDF(url);
        texts.push(text);
      }

      const produtos1 = texts[0].split('\n').map(t => t.trim()).filter(Boolean);
      const produtos2 = texts[1].split('\n').map(t => t.trim()).filter(Boolean);

      const produtosComuns = produtos1.filter(produto => 
        produtos2.some(p => p.toLowerCase().includes(produto.toLowerCase()))
      );

      setComparisonResult(produtosComuns);

    } catch (error) {
      console.error('Erro ao comparar folhetos:', error);
      alert('Falha ao processar OCR.');
    } finally {
      setLoadingOCR(false);
    }
  };

  const extractTextFromPDF = async (url) => {
    const pdf = await pdfjsLib.getDocument(url).promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;

      const image = canvas.toDataURL('image/png');

      const { data: { text } } = await Tesseract.recognize(
        image,
        'por', // língua portuguesa
        { logger: m => console.log(m) }
      );

      fullText += text + '\n';
    }

    return fullText;
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Smart Folhetos</h1>
        <p>Envie e compare folhetos de supermercados!</p>
      </div>

      <div className="upload-container">
        <h2>Enviar Novo Folheto</h2>
        <form onSubmit={handleUpload} className="upload-form">
          <input type="file" onChange={handleFileChange} className="file-input" />
          <button type="submit" className="submit-btn">Enviar Folheto</button>
        </form>
      </div>

      <div className="upload-container">
        <h2>Folhetos Disponíveis</h2>
        <ul className="folhetos-list">
          {folhetos.map((folheto) => (
            <li key={folheto.name}>
              <input
                type="checkbox"
                onChange={(e) => handleSelectFolheto(e, folheto.name)}
                checked={selectedFolhetos.includes(folheto.name)}
              />
              {folheto.name.split('/').pop()}
            </li>
          ))}
        </ul>
        <button
          onClick={compareFolhetos}
          className="submit-btn"
          disabled={selectedFolhetos.length !== 2 || loadingOCR}
        >
          {loadingOCR ? 'Processando OCR...' : 'Comparar Folhetos'}
        </button>
      </div>

      {comparisonResult && (
        <div className="compare-section">
          <h3>Produtos Comuns</h3>
          {comparisonResult.length > 0 ? (
            comparisonResult.map((produto, index) => (
              <p key={index}>{produto}</p>
            ))
          ) : (
            <p>Nenhum produto em comum encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
