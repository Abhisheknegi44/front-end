import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditorFile = (props) => {
    const { isDisabled, selectedFile, setShowEditor, editorContent, setEditorContent, editFile, createFile } = props
    return (
        <>
            <h2>{selectedFile ? "Edit File" : "Create New File"}</h2>
            <ReactQuill
                theme="snow"
                value={editorContent}
                onChange={(value) => setEditorContent(value)}
                readOnly={isDisabled}
                style={{ height: "200px", marginBottom: "20px" }}
            />
            {!isDisabled ? <><button onClick={selectedFile ? editFile : createFile} style={{ marginRight: "10px", marginTop: "33px" }}>
                {selectedFile ? "Save Changes" : "Create File"}
            </button>
                <button onClick={() => setShowEditor(false)} style={{ color: "gray" }}>
                    Cancel
                </button></> : <></>}
        </>
    )
}

export default EditorFile