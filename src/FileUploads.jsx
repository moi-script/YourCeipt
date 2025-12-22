import { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Idle"); // Idle, Uploading, Success, Error
  const [result, setResult] = useState(null);   // To store the OCR/AI response

  // 1. Handle File Selection
  const handleFileChange = (e) => {
    // Access the first file selected
    setFile(e.target.files[0]);
    setStatus("Idle"); 
    setResult(null);
  };

  // 2. Send to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first!");

    // CRITICAL STEP: Create FormData
    // You cannot send files as simple JSON. You must use FormData.
    const formData = new FormData();
    
    // 'myImage' MUST match the string you used in upload.single('myImage') in Express
    formData.append('myImage', file); 

    setStatus("Uploading...");

    try {
      // Send POST request
      // Note: We don't need to manually set 'Content-Type': 'multipart/form-data'. 
      // Axios does this automatically and correctly sets the 'boundary'.
      const response = await axios.post('http://localhost:3000/upload', formData);

      // Handle Success
      setStatus("Success");
      console.log(response.data);
      
      // If your 'service' returns text (like Tesseract), display it:
      setResult(response.data); 

    } catch (error) {
      console.error(error);
      setStatus("Error");
      alert("Upload failed.");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Document for Scanning</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept="image/*" // Optional: limits file picker to images
          />
        </div>

        <button type="submit" disabled={!file || status === "Uploading"}>
          {status === "Uploading" ? "Processing..." : "Upload & Scan"}
        </button>
      </form>

      {/* Status Indicators */}
      {status === "Success" && <p style={{color: 'green'}}>File processed successfully!</p>}
      {status === "Error" && <p style={{color: 'red'}}>Something went wrong.</p>}

      {/* Result Display (e.g. for your Tesseract text) */}
      {result && (
        <div className="result-box" style={{marginTop: '20px', padding: '10px', border: '1px solid #ccc'}}>
          <h4>Extracted Data:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;