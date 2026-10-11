
function ResumeUpload({ files, setFiles, setError }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <span className="step-number">02</span>
        <div>
          <h2>Candidate resumes</h2>
          <p>Upload multiple PDF or Word documents.</p>
        </div>
      </div>

      <label className="upload-area" htmlFor="resume-files">
        <span className="upload-icon">↑</span>
        <strong>Choose resume files</strong>
        <span>PDF or DOCX · Select multiple files</span>
        <input
          id="resume-files"
          type="file"
          accept=".pdf,.docx"
          multiple

onChange={(event) => {
  const newFiles = Array.from(event.target.files || []);

  setFiles((currentFiles) => {
    const existingKeys = new Set(
      currentFiles.map((file) => `${file.name}-${file.size}`)
    );

    const uniqueNewFiles = newFiles.filter(
      (file) => !existingKeys.has(`${file.name}-${file.size}`)
    );

    if (uniqueNewFiles.length < newFiles.length) {
      setError("Duplicate resumes were skipped. Each file can be uploaded only once.");
    } else {
      setError("");
    }

    return [...currentFiles, ...uniqueNewFiles];
  });

  event.target.value = "";
}}

        />
      </label>

      {files.length > 0 && (
        <div className="selected-files">
          <div className="selected-header">
            <strong>{files.length} file(s) selected</strong>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setFiles([]);
                setError("");
              }}
            >
              Clear
            </button>
          </div>

          {files.map((file, index) => (
            <div className="file-row" key={`${file.name}-${index}`}>
              <span className="file-badge">
                {file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX"}
              </span>
              <span className="file-name">{file.name}</span>
              <button
                type="button"
                className="remove-file"
                aria-label={`Remove ${file.name}`}
                onClick={() => {
                  setFiles((current) =>
                    current.filter((_, fileIndex) => fileIndex !== index)
                  );
                  setError("");
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ResumeUpload;
