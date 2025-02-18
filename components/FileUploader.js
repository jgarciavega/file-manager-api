import { useState, useCallback } from 'react';

const FileUploader = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFile = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      onUploadComplete?.(data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-4">
        {preview && (
          <img 
            src={preview} 
            alt="Preview" 
            className="h-20 w-20 rounded object-cover border"
          />
        )}
        <label className="flex-1 cursor-pointer">
          <input
            type="file"
            onChange={handleFile}
            className="hidden"
            accept="image/*"
          />
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-blue-500">
            <p className="text-sm text-gray-600">
              Arrastra tu archivo o haz clic aquí
            </p>
          </div>
        </label>
      </div>
      
      <button
        onClick={handleUpload}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        disabled={!selectedFile}
      >
        Subir Imagen
      </button>
    </div>
  );
};

export default FileUploader;