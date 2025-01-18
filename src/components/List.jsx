import { useState, useEffect } from "react";
import axios from "axios";
import EditorFile from "./EditorFile";

const List = () => {
  const [editorContent, setEditorContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEditor, setShowEditor] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/fileUpload");
      setFileList(response.data.txtFile);
      if (response.data.txtFile.length === 0) {
        setShowEditor(true);
      } else {
        setShowEditor(false);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const createFile = async () => {
    try {
      const formData = new FormData();
      const blob = new Blob([editorContent], { type: "text/plain" });
      const file = new File([blob], `newFile${fileList.length + 1}.txt`, {
        type: "text/plain",
      });
      formData.append("media", file);
      await axios.post("http://localhost:9000/api/fileUpload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchFiles();
      setEditorContent("");
      setShowEditor(false);
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  const editFile = async () => {
    try {
      await axios.put(
        `http://localhost:9000/api/fileUpload/${selectedFile._id}`,
        {
          content: editorContent,
        },
      );
      fetchFiles();
      setShowEditor(false);
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  const deleteFile = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/fileUpload/${id}`);
      await fetchFiles();
      setSelectedFile(null);
      setEditorContent("");
      setIsDisabled(false);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const openFile = async (file) => {
    const response = await axios.get(
      `http://localhost:9000/api/fileUpload/files/${file._id}`,
    );
    setSelectedFile(file);
    setEditorContent(response.data.content);
    setShowEditor(true);
    setIsDisabled(false);
  };

  const viewFile = async (file) => {
    const response = await axios.get(
      `http://localhost:9000/api/fileUpload/files/${file._id}`,
    );
    setSelectedFile(file);
    setEditorContent(response.data.content);
    setShowEditor(true);
    setIsDisabled(true);
  };

  const openEditorForNewFile = () => {
    setSelectedFile(null);
    setEditorContent("");
    setShowEditor(true);
    setIsDisabled(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Text File Editor</h1>

      <div>
        <h2>Files</h2>
        {fileList.length === 0 ? (
          <p>No files available.</p>
        ) : (
          <ul>
            {fileList.map((file) => (
              <li key={file._id} style={{ marginBottom: "10px" }}>
                <span>{file.fileName}</span>
                <button
                  onClick={() => viewFile(file)}
                  style={{ marginLeft: "10px", color: "blue" }}
                >
                  View
                </button>
                <button
                  onClick={() => openFile(file)}
                  style={{ marginLeft: "10px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteFile(file._id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        <button onClick={openEditorForNewFile} style={{ marginTop: "10px" }}>
          Create New File
        </button>
      </div>
      {showEditor && (
        <div style={{ marginTop: "20px" }}>
          <EditorFile
            selectedFile={selectedFile}
            setShowEditor={setShowEditor}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
            editFile={editFile}
            createFile={createFile}
            isDisabled={isDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default List;
