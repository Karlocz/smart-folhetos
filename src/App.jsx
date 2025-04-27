import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .storage
      .from('folhetos')
      .list('', { limit: 100 });

    if (error) {
      console.error('Erro ao buscar arquivos:', error);
    } else {
      // Ordena os arquivos pela data de criação
      const sortedData = data.sort((a, b) => b.created_at - a.created_at);
      setFiles(sortedData);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Por favor, selecione um arquivo PDF válido.');
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor, selecione um arquivo primeiro.');
      return;
    }

    const filePath = `${Date.now()}-${selectedFile.name}`;

    const { error } = await supabase
      .storage
      .from('folhetos')
      .upload(filePath, selectedFile);

    if (error) {
      console.error('Erro ao enviar:', error);
      alert('Erro ao enviar o folheto.');
    } else {
      alert('Folheto enviado com sucesso!');
      setSelectedFile(null);
      setPreviewUrl('');
      fetchFiles();
    }
  };

  const getPublicUrl = (fileName) => {
    const { publicURL } = supabase
      .storage
      .from('folhetos')
      .getPublicUrl(fileName);

    return publicURL;
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#0d6efd' }}>📄 Smart Folhetos</h1>
      <p style={{ fontSize: '18px', color: '#333' }}>
        Compare ofertas de supermercados de forma rápida!
      </p>

      <div style={{ marginTop: '30px' }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleUpload}
          style={{
            marginLeft: '15px',
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          Enviar Folheto
        </button>
      </div>

      {selectedFile && (
        <div style={{ marginTop: '30px' }}>
          <h3>Pré-visualização do Folheto:</h3>
          <iframe
            src={previewUrl}
            title="Pré-visualização do PDF"
            width="100%"
            height="500px"
            style={{ border: '1px solid #ccc', borderRadius: '8px' }}
          ></iframe>
        </div>
      )}

      <div style={{ marginTop: '50px' }}>
        <h2>🔍 Buscar Folheto:</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Buscar pelo nome do folheto..."
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            width: '300px',
          }}
        />
      </div>

      <div style={{ marginTop: '50px' }}>
        <h2>🗂️ Folhetos Disponíveis:</h2>
        {filteredFiles.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            {filteredFiles.map((file) => (
              <div
                key={file.name}
                style={{
                  width: '250px',
                  padding: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <iframe
                  src={getPublicUrl(file.name)}
                  title={file.name}
                  width="100%"
                  height="200px"
                  style={{ border: 'none', borderRadius: '8px' }}
                ></iframe>
                <p
                  style={{
                    marginTop: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {file.name.length > 30
                    ? file.name.substring(0, 30) + '...'
                    : file.name}
                </p>
                <a
                  href={getPublicUrl(file.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: '10px',
                    display: 'inline-block',
                    backgroundColor: '#198754',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  Ver Folheto
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ marginTop: '20px' }}>Nenhum folheto enviado ainda.</p>
        )}
      </div>
    </div>
  );
}

export default App;
