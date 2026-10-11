
import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import JobDescriptionForm from "./components/JobDescriptionForm";
import ResumeUpload from "./components/ResumeUpload";
import CandidateList from "./components/CandidateList";
import DashboardStats from "./components/DashboardStats";
import CandidateComparison from "./components/CandidateComparison";
import ScreeningHistory from "./components/ScreeningHistory";

import { screenResumes } from "./services/screeningApi";
import { downloadCSV, downloadPDF } from "./utils/exportReports";

function App() {
  const [currentPage, setCurrentPage] = useState("screening");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [failed, setFailed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResults([]);
    setFailed([]);

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    if (!files.length) {
      setError("Please upload at least one PDF or DOCX resume.");
      return;
    }

    setLoading(true);

    try {
      const data = await screenResumes(jobTitle, jobDescription, files);

      setResults(data.results || []);
      setFailed(data.failed || []);
    } catch (err) {
      setError(
        `${err.message} Check that Django is running and the frontend is allowed to access the API.`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      {currentPage === "screening" ? (
        <main className="main-content">
          <section className="hero">
            <span className="eyebrow">SMARTER HIRING STARTS HERE</span>

            <h1>
              Find your next
              <br />
              <span>great candidate.</span>
            </h1>

            <p>
              Analyze resumes against your job requirements with AI-powered
              assessments and transparent skill matching.
            </p>
          </section>

          <form className="screening-form" onSubmit={handleSubmit}>
            <JobDescriptionForm
  jobTitle={jobTitle}
  setJobTitle={setJobTitle}
  jobDescription={jobDescription}
  setJobDescription={setJobDescription}
/>

            <ResumeUpload
              files={files}
              setFiles={setFiles}
              setError={setError}
            />

            {error && <div className="error-message">{error}</div>}

            <button
              className="analyze-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Analyzing resumes..." : "Analyze candidates →"}
            </button>

            <p className="privacy-note">
              Candidate data is processed by your local backend and the
              configured AI provider. Review privacy requirements before
              using real resumes.
            </p>
          </form>


{(results.length > 0 || failed.length > 0) && (
  <>
    <DashboardStats results={results} failed={failed} />

    <section className="export-actions">
      <div>
        <h2>Export screening report</h2>
        <p>Download your candidate results for later review.</p>
      </div>

      <div className="export-buttons">
        <button
          type="button"
          className="export-button csv-button"
          onClick={() =>
            downloadCSV(jobTitle, results, failed)
          }
        >
          Download CSV
        </button>

        <button
          type="button"
          className="export-button pdf-button"
          onClick={() =>
            downloadPDF(jobTitle, results, failed)
          }
        >
          Download PDF Report
        </button>
      </div>
    </section>

    <CandidateComparison candidates={results} />
    <CandidateList results={results} failed={failed} />
  </>
)}

        </main>
      ) : (
        <main className="main-content">
          <ScreeningHistory />
        </main>
      )}

      <footer className="footer">
        TalentLens · Built with React, Django and Generative AI
      </footer>
    </div>
  );
}

export default App;
