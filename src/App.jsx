import React, { useState } from 'react';

function UploadFolheto() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Armazena o arquivo no estado
    }
  };

  const handleSubmit = () => {
    // Aqui você pode chamar a API backend ou processar o arquivo diretamente
    if (file) {
      // Enviar o arquivo para análise
      console.log('Arquivo para análise:', file);
      // Exemplo de envio para uma API backend
      // Envie o arquivo para o backend (por exemplo, Express ou Supabase)
      uploadFolheto(file);
    }
  };

  const uploadFolheto = async (file) => {
    // Aqui você pode fazer a chamada de API para enviar o arquivo
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/upload-folheto', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Folheto salvo para análise:', data);
      } else {
        console.error('Falha ao enviar o folheto.');
      }
    } catch (error) {
      console.error('Erro ao enviar o folheto:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Salvar para Análise</button>
    </div>
  );
}

export default UploadFolheto;
