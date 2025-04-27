import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

function UploadForm({ loadFolhetos }) {
  const [file, setFile] = useState(null);

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
      const { data, error } = await supabase.storage
        .from('folhetos')
        .upload(`folheto-${Date.now()}`, file);

      if (error) {
        throw new Error(error.message);
      }

      // Salvar os detalhes do arquivo no banco de dados
      await supabase
        .from('folhetos')
        .insert([{ nome: file.name, url: data.Key, created_at: new Date() }]);

      loadFolhetos();  // Atualizar lista de folhetos após upload
      alert("Folheto enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Falha no envio do folheto.");
    }
  };

  return (
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
  );
}

export default UploadForm;
