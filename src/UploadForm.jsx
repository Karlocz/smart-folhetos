import { useState } from "react";

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage("Por favor, selecione um arquivo PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Upload realizado com sucesso!");
      } else {
        setMessage(`Erro: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erro ao fazer upload.");
    }
  };

  return (
    <div>
      <h2>Upload de Folheto PDF</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit">Enviar PDF</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}