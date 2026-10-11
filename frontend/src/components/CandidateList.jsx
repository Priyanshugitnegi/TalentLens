
import { useMemo, useState } from "react";
import CandidateCard from "./CandidateCard";

function CandidateList({ results, failed }) {
  const [sortBy, setSortBy] = useState("score");
  const [minScore, setMinScore] = useState("0");
  const [search, setSearch] = useState("");

  const candidates = useMemo(() => {
    const filtered = results.filter((candidate) => {
      const name = (candidate.name || "").toLowerCase();
      const filename = (candidate.filename || "").toLowerCase();
      const query = search.toLowerCase();

      return (
        candidate.match_score >= Number(minScore) &&
        (name.includes(query) || filename.includes(query))
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "score") {
        return b.match_score - a.match_score;
      }

      return (a.name || "").localeCompare(b.name || "");
    });
  }, [results, sortBy, minScore, search]);

  return (
    <section className="results-section">
      <div className="results-heading">
        <div>
          <span className="eyebrow">SCREENING REPORT</span>
          <h2>Candidate rankings</h2>
        </div>

        <span className="result-count">
          {candidates.length} of {results.length} candidates
        </span>
      </div>

      <div className="candidate-filters">
        <input
          type="search"
          placeholder="Search candidate or filename..."
          aria-label="Search candidates"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          aria-label="Sort candidates"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="score">Highest match first</option>
          <option value="name">Name A–Z</option>
        </select>

        <select
          aria-label="Minimum match score"
          value={minScore}
          onChange={(event) => setMinScore(event.target.value)}
        >
          <option value="0">All scores</option>
          <option value="50">50% and above</option>
          <option value="70">70% and above</option>
          <option value="80">80% and above</option>
          <option value="90">90% and above</option>
        </select>
      </div>

      {candidates.length > 0 ? (
        candidates.map((candidate, index) => (
          <CandidateCard
            candidate={candidate}
            key={`${candidate.filename}-${index}`}
          />
        ))
      ) : (
        <div className="empty-results">
          <h3>No matching candidates</h3>
          <p>Try a different search or lower the minimum match score.</p>
        </div>
      )}

      {failed.map((item, index) => (
        <div className="error-message" key={`${item.filename}-${index}`}>
          <strong>{item.filename}:</strong> {item.error}
        </div>
      ))}

      <p className="disclaimer">
        Rankings reflect the configured skill-matching method, not a
        definitive measure of candidate ability. Review resumes yourself
        before making hiring decisions.
      </p>
    </section>
  );
}

export default CandidateList;
