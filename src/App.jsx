import React, { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // cria URL temporária para visualização
    } else {
      alert('Por favor, selecione um arquivo PDF válido.');
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Aqui você faria o upload do arquivo para o servidor ou serviço de armazenamento
      alert(`Arquivo "${selectedFile.name}" enviado com sucesso!`);
      // Limpa a seleção
      setSelectedFile(null);
      setPreviewUrl('');
    } else {
      alert('Por favor, selecione um arquivo primeiro.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bem-vindo ao Smart Folhetos!</h1>
      <p>Agora você pode comparar ofertas de supermercado facilmente.</p>

      <div style={{ marginTop: '20px' }}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button onClick={handleUpload} style={{ marginLeft: '10px' }}>
          Enviar Folheto
        </button>
      </div>

      {selectedFile && (
        <div style={{ marginTop: '20px' }}>
          <h3>Pré-visualização do Folheto:</h3>
          <iframe
            src={previewUrl}
            title="Pré-visualização do PDF"
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc' }}
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default App;
