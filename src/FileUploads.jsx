// FileUpload.jsx
import { useState } from 'react';
import axios from 'axios';

const MultipleUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (e) => {
    // 1. Capture all files (e.target.files is a FileList, not an Array)
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFiles) return;

    const formData = new FormData();

    // 2. LOOP is required!
    // We append each file using the SAME key 'myImages'
    for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('myImages', selectedFiles[i]);
    }

    try {
      const res = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Uploaded:', res.data);
      alert(`${selectedFiles.length} files uploaded!`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 3. Add the 'multiple' attribute */}
      <input 
        type="file" 
        multiple 
        name="myImages"
        onChange={handleFileChange} 
      />
      <button type="submit">Upload Multiple</button>
    </form>
  );
};

export default MultipleUpload;