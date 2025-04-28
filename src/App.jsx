import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Tesseract from 'tesseract.js';

// Conexão com Supabase
const supabase = createClient(
  'https://ongdxywgxszpxopxqfyq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZ2R4eXdneHN6cHhvcHhxZnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzQ5OTYsImV4cCI6MjA2MTM1MDk5Nn0.Z3utIhlvB4lbb3GghbwDiLno8EEmLqcthVhxiguI70c'
);

function App() {
  const [file, setFile] = useState(null);
  const [folhetos, setFolhetos] = useState([]);
  const [ocrResult, setOcrResult] = useState("");

  // Função para fazer o OCR em PDF
  const handleOcr = async (file) => {
    try {
      const { data: { text } } = await Tesseract.recognize(
        file,
        'por', // Idioma português
        {
          logger: (m) => console.log(m),
        }
      );
      setOcrResult(text);
    } catch (error) {
      console.error("Falha ao processar OCR", error);
      alert("Falha ao processar OCR");
    }
  };

  // Função para fazer o upload do folheto
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Por favor, selecione um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("folheto", file);

    try {
      // Envia o arquivo para o Supabase
      const { data, error } = await supabase.storage
        .from('folhetos')
        .upload(`upload/${file.name}`, file);

      if (error) {
        console.error("Erro ao enviar arquivo:", error.message);
        alert("Falha no envio do arquivo.");
      } else {
        alert("Arquivo enviado com sucesso!");
        // Processa o OCR do folheto
        await handleOcr(file);
      }
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Falha no envio do arquivo.");
    }
  };

  // Função para listar os folhetos já enviados
  useEffect(() => {
    const fetchFolhetos = async () => {
      const { data, error } = await supabase
        .storage
        .from('folhetos')
        .list('upload', { limit: 100, offset: 0 });

      if (error) {
        console.error('Erro ao listar arquivos:', error.message);
      } else {
        const arquivos = data
          .filter(item => item.metadata && item.metadata.size > 0) // Filtra apenas arquivos, ignorando pastas
          .map(item => ({
            name: item.name,
            publicUrl: supabase
              .storage
              .from('folhetos')
              .getPublicUrl(`upload/${item.name}`).publicURL
          }));
        
        setFolhetos(arquivos); // Atualiza o estado com a lista de arquivos
      }
    };

    fetchFolhetos(); // Chama a função para buscar os arquivos
  }, []); // O array vazio [] significa que o useEffect só rodará na montagem inicial

  return (
    <div>
      <h1>Smart Folhetos</h1>
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

      {/* Listagem de Folhetos Enviados */}
      <div className="folheto-list">
        <h2>Lista de Folhetos Enviados</h2>
        <ul>
          {folhetos.length > 0 ? (
            folhetos.map((folheto, index) => (
              <li key={index}>
                <a href={folheto.publicUrl} target="_blank" rel="noopener noreferrer">
                  {folheto.name}
                </a>
              </li>
            ))
          ) : (
            <p>Nenhum folheto encontrado.</p>
          )}
        </ul>
      </div>

      {/* Exibição do resultado do OCR */}
      <div className="ocr-result">
        <h2>Resultado OCR</h2>
        <pre>{ocrResult}</pre>
      </div>
    </div>
  );
}

export default App;
