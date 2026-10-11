
import { useState } from "react";

const SKILL_GROUPS = {
  "Programming Languages": [
    "Python", "Java", "JavaScript", "TypeScript", "C", "C++", "C#",
    "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "R", "Scala",
  ],
  "Frontend Development": [
    "HTML", "CSS", "Sass", "Tailwind CSS", "Bootstrap", "React",
    "Next.js", "Angular", "Vue.js", "Vite", "Redux", "jQuery",
    "Responsive Design",
  ],
  "Backend Development": [
    "Node.js", "Express.js", "Django", "Django REST Framework",
    "Flask", "FastAPI", "Spring Boot", "Laravel", "NestJS",
    "Microservices",
  ],
  "APIs": [
    "REST API", "GraphQL", "WebSockets", "API Development",
    "API Integration", "JSON", "XML", "OAuth", "JWT", "OpenAPI",
    "API Documentation",
  ],
  "Relational Databases": [
    "SQL", "PostgreSQL", "MySQL", "SQLite", "Microsoft SQL Server",
    "Oracle Database", "MariaDB", "Database Design",
    "Query Optimization", "Database Indexing",
  ],
  "NoSQL and Caching": [
    "MongoDB", "Redis", "Elasticsearch", "DynamoDB", "Firebase",
    "Supabase", "Cassandra", "Caching", "Vector Databases",
  ],
  "Cloud and DevOps": [
    "AWS", "Microsoft Azure", "Google Cloud", "Docker", "Kubernetes",
    "Jenkins", "GitHub Actions", "GitLab CI/CD", "CI/CD", "Terraform",
    "Ansible", "Linux", "Nginx", "Render", "Railway", "Vercel",
    "Netlify", "Monitoring", "Logging",
  ],
  "Developer Tools": [
    "Git", "GitHub", "GitLab", "Bitbucket", "Postman", "Insomnia",
    "VS Code", "PyCharm", "Jira", "Confluence",
  ],
  "Testing and Quality": [
    "Unit Testing", "Integration Testing", "Pytest", "Unittest",
    "Jest", "Selenium", "Cypress", "Playwright", "Test Automation",
    "Debugging", "Code Review", "Agile", "Scrum",
  ],
  "Data and Analytics": [
    "NumPy", "Pandas", "Matplotlib", "Seaborn", "Plotly", "Excel",
    "Power BI", "Tableau", "ETL", "Data Cleaning",
    "Data Visualization", "Statistics", "Exploratory Data Analysis",
  ],
  "AI and Machine Learning": [
    "Machine Learning", "Deep Learning", "Artificial Intelligence",
    "Natural Language Processing", "Computer Vision", "Generative AI",
    "Large Language Models", "Prompt Engineering", "LangChain",
    "LlamaIndex", "TensorFlow", "PyTorch", "Scikit-learn", "Keras",
    "Hugging Face", "OpenCV", "RAG", "Model Evaluation",
    "Feature Engineering",
  ],
  Security: [
    "Cybersecurity", "Application Security", "Authentication",
    "Authorization", "Encryption", "OWASP", "Secure Coding",
  ],
};

function getSkills(candidate, field) {
  return Array.isArray(candidate[field]) ? candidate[field] : [];
}

function groupSkills(skills) {
  const groups = {};

  for (const skill of skills) {
    const group =
      Object.entries(SKILL_GROUPS).find(([, items]) =>
        items.includes(skill)
      )?.[0] || "Other Skills";

    if (!groups[group]) {
      groups[group] = [];
    }

    if (!groups[group].includes(skill)) {
      groups[group].push(skill);
    }
  }

  return groups;
}

function SkillTags({ skills, variant = "matched", emptyText }) {
  if (!skills.length) {
    return <p className="muted">{emptyText || "None detected"}</p>;
  }

  return (
    <div className="tag-list">
      {skills.map((skill) => (
        <span className={`tag ${variant}`} key={skill}>
          {skill}
        </span>
      ))}
    </div>
  );
}

function GroupedSkills({ skills }) {
  const groups = groupSkills(skills);

  if (!skills.length) {
    return <p className="muted">No skills detected.</p>;
  }

  return (
    <div className="grouped-skills">
      {Object.entries(groups).map(([group, items]) => (
        <div className="skill-group" key={group}>
          <h4>{group}</h4>
          <SkillTags skills={items} />
        </div>
      ))}
    </div>
  );
}

function CandidateCard({ candidate }) {
  const [showDetails, setShowDetails] = useState(false);

  const score = Math.max(
    0,
    Math.min(100, Number(candidate.match_score) || 0)
  );

  const strengths = getSkills(candidate, "strengths");
  const matchedSkills = getSkills(candidate, "matched_skills");
  const missingSkills = getSkills(candidate, "missing_skills");
  const detectedSkills = getSkills(candidate, "detected_skills");
  const additionalSkills = getSkills(candidate, "additional_skills");

  return (
    <>
      <article className="candidate-card">
        <div className="candidate-top">
          <div className="avatar">
            {(candidate.name || "?").charAt(0).toUpperCase()}
          </div>

          <div className="candidate-info">
            <h3>{candidate.name || "Unknown candidate"}</h3>
            <p>{candidate.filename || "Resume"}</p>
          </div>

          <div className="score">
            <strong>{score.toFixed(2)}%</strong>
            <span>Skill match</span>
          </div>
        </div>

        <div
          className="score-track"
          role="progressbar"
          aria-label="Candidate skill match"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="score-fill"
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="candidate-details">
          <div>
            <h4>Matched requirements</h4>
            <SkillTags
              skills={matchedSkills}
              emptyText="No matched requirements detected"
            />
          </div>

          <div>
            <h4>Missing requirements</h4>
            <SkillTags
              skills={missingSkills}
              variant="missing"
              emptyText="No detected gaps"
            />
          </div>
        </div>

        <div className="assessment">
          <h4>AI assessment</h4>
          <p>
            {candidate.overall_assessment ||
              "No assessment available."}
          </p>
        </div>

        <button
          type="button"
          className="view-details-button"
          onClick={() => setShowDetails(true)}
        >
          View candidate details
        </button>
      </article>

      {showDetails && (
        <div
          className="candidate-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowDetails(false);
            }
          }}
        >
          <section
            className="candidate-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="candidate-modal-title"
          >
            <div className="candidate-modal-header">
              <div>
                <span className="eyebrow">CANDIDATE PROFILE</span>
                <h2 id="candidate-modal-title">
                  {candidate.name || "Unknown candidate"}
                </h2>
                <p>{candidate.filename || "Resume"}</p>
              </div>

              <button
                type="button"
                className="candidate-modal-close"
                aria-label="Close candidate details"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>

            <div className="candidate-modal-body">
              <div className="detail-score">
                <span>Job match score</span>
                <strong>{score.toFixed(2)}%</strong>
                <div className="score-track">
                  <div
                    className="score-fill"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>

              <section className="detail-section">
                <h3>Matched job requirements</h3>
                <SkillTags
                  skills={matchedSkills}
                  emptyText="No matched requirements detected"
                />
              </section>

              <section className="detail-section">
                <h3>Missing job requirements</h3>
                <SkillTags
                  skills={missingSkills}
                  variant="missing"
                  emptyText="No detected gaps"
                />
              </section>

              <section className="detail-section">
                <h3>All detected skills</h3>
                <GroupedSkills skills={detectedSkills} />
              </section>

              <section className="detail-section">
                <h3>Additional skills</h3>
                <p className="muted">
                  Skills detected in the resume but not explicitly
                  required by this job description.
                </p>
                <GroupedSkills skills={additionalSkills} />
              </section>

              <section className="detail-section">
                <h3>Strengths and experience</h3>
                <SkillTags
                  skills={strengths}
                  emptyText="No additional strengths provided"
                />
              </section>

              <section className="detail-section">
                <h3>AI assessment</h3>
                <p>
                  {candidate.overall_assessment ||
                    "No assessment available."}
                </p>
              </section>

              <p className="disclaimer">
                Screening results are decision-support information.
                Review the original resume before making hiring
                decisions.
              </p>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default CandidateCard;
