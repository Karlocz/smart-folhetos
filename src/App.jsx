import React, { useState, useEffect } from 'react';
import './App.css';
import supabase from './services/supabaseClient';
import Tesseract from 'tesseract.js';

function App() {
  const [file, setFile] = useState(null);
  const [folhetos, setFolhetos] = useState([]);
  const [ocrResult, setOcrResult] = useState('');
  const [isLoadingOCR, setIsLoadingOCR] = useState(false);

  const fetchFolhetos = async () => {
    const { data, error } = await supabase
      .storage
      .from('folhetos')
      .list('public', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error('Erro ao carregar os folhetos:', error);
    } else {
      setFolhetos(data);
    }
  };

  useEffect(() => {
    fetchFolhetos();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Por favor, selecione um arquivo.");
      return;
    }

    const { data, error } = await supabase
      .storage
      .from('folhetos')
      .upload(`public/${file.name}`, file);

    if (error) {
      console.error('Erro ao enviar arquivo:', error);
      alert('Falha no envio do arquivo.');
    } else {
      alert('Arquivo enviado com sucesso!');
      fetchFolhetos(); // Atualiza a lista
    }
  };

  const getPublicUrl = (path) => {
    const { publicURL } = supabase
      .storage
      .from('folhetos')
      .getPublicUrl(`public/${path}`);
    return publicURL;
  };

  const handleOCR = async (path) => {
  const imageUrl = getPublicUrl(path);

  setIsLoadingOCR(true);
  setOcrResult('');

  console.log("Fazendo OCR na imagem:", imageUrl); // Adicione este log para verificar o URL!

  try {
    const result = await Tesseract.recognize(
      imageUrl,
      'por', // idioma português
      { logger: m => console.log(m) }
    );

    setOcrResult(result.data.text);
  } catch (error) {
    console.error('Erro no OCR:', error);
    alert('Falha ao processar OCR.');
  } finally {
    setIsLoadingOCR(false);
  }
};

  return (
    <div className="app-container">
      <div className="header">
        <h1>Bem-vindo ao Smart Folhetos!</h1>
        <p>Agora você pode comparar ofertas de supermercado facilmente.</p>
      </div>

      <div className="upload-container">
        <h2>Envie seu Folheto</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
          <button type="submit" className="submit-btn">Enviar Folheto</button>
        </form>
      </div>

      <div className="folhetos-list">
        <h2>Folhetos Enviados</h2>
        <ul>
          {folhetos.length > 0 ? (
            folhetos.map((folheto) => (
              <li key={folheto.name}>
                <a href={getPublicUrl(folheto.name)} target="_blank" rel="noopener noreferrer">
                  {folheto.name}
                </a>
                <button onClick={() => handleOCR(folheto.name)} className="submit-btn" style={{ marginLeft: '10px' }}>
                  Ler Texto (OCR)
                </button>
              </li>
            ))
          ) : (
            <li>Nenhum folheto encontrado.</li>
          )}
        </ul>
      </div>

      {isLoadingOCR && <p>Processando OCR, aguarde...</p>}

      {ocrResult && (
        <div className="ocr-result">
          <h2>Texto Extraído:</h2>
          <pre>{ocrResult}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
