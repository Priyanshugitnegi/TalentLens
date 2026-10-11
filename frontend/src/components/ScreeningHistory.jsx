
import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/screening/history/`;
function ScreeningHistory() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to load screening history.");
        }

        const data = await response.json();
        setSessions(data.history || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <section className="history-page">
        <p>Loading screening history...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="history-page">
        <h2>Screening History</h2>
        <p className="history-error">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="history-page">
      <div className="history-heading">
        <div>
          <span className="eyebrow">YOUR PREVIOUS SCREENINGS</span>
          <h2>Screening History</h2>
          <p>Review results from previously completed screening sessions.</p>
        </div>

        <div className="history-count">
          <strong>{sessions.length}</strong>
          <span>Sessions</span>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="history-empty">
          <h3>No screening history yet</h3>
          <p>Your completed screening sessions will appear here.</p>
        </div>
      ) : (
        <div className="history-list">
          {sessions.map((session) => {
            const results = session.results || [];
            const successful = results.filter(
              (result) => "match_score" in result
            );

            const averageScore = successful.length
              ? successful.reduce(
                  (sum, result) => sum + Number(result.match_score || 0),
                  0
                ) / successful.length
              : 0;

            return (
              <details className="history-card" key={session.id}>
                <summary className="history-card-summary">
                  <div className="history-card-title">
                    <span className="history-session-id">
                      Session #{session.id}
                    </span>
                    <h3>{session.job_title || "Untitled Job"}</h3>
                    <span className="history-date">
                      {new Date(session.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="history-card-stats">
                    <div>
                      <strong>{session.total_resumes}</strong>
                      <span>Resumes</span>
                    </div>
                    <div>
                      <strong>{averageScore.toFixed(2)}%</strong>
                      <span>Average match</span>
                    </div>
                    <span className="history-expand">View results ↓</span>
                  </div>
                </summary>

                <div className="history-card-content">
                  <h4>Job description</h4>
                  <p className="history-job-description">
                    {session.job_description}
                  </p>

                  <div className="history-summary-stats">
                    <span>Successful: {session.successful}</span>
                    <span>Failed: {session.failed}</span>
                  </div>

                  <h4>Candidate results</h4>

                  {results.length === 0 ? (
                    <p>No candidate results were saved.</p>
                  ) : (
                    <div className="history-results">
                      {results.map((candidate, index) => (
                        <article
                          className="history-result"
                          key={`${candidate.filename || "candidate"}-${index}`}
                        >
                          <div>
                            <strong>
                              {candidate.name || candidate.filename || "Unknown candidate"}
                            </strong>
                            <p>{candidate.filename}</p>
                          </div>

                          {"match_score" in candidate ? (
                            <strong className="history-result-score">
                              {Number(candidate.match_score).toFixed(2)}%
                            </strong>
                          ) : (
                            <span className="history-result-failed">
                              Analysis failed
                            </span>
                          )}

                          {"match_score" in candidate && (
                            <details className="history-candidate-details">
                              <summary>Details</summary>

                              <h5>Matched requirements</h5>
                              <p>
                                {(candidate.matched_skills || []).join(", ") ||
                                  "None detected"}
                              </p>

                              <h5>Missing requirements</h5>
                              <p>
                                {(candidate.missing_skills || []).join(", ") ||
                                  "None detected"}
                              </p>

                              <h5>Additional skills</h5>
                              <p>
                                {(candidate.additional_skills || []).join(", ") ||
                                  "None detected"}
                              </p>

                              <h5>Assessment</h5>
                              <p>
                                {candidate.overall_assessment ||
                                  "No assessment available."}
                              </p>
                            </details>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ScreeningHistory;
