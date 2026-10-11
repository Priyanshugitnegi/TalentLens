import React from "react";
const SKILL_GROUPS = {
  "Programming Languages": [
    "Python", "Java", "JavaScript", "TypeScript", "C", "C++", "C#",
    "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "R", "Scala",
    "Dart", "MATLAB", "Bash", "PowerShell",
  ],
  "Frontend Development": [
    "HTML", "CSS", "Sass", "Tailwind CSS", "Bootstrap", "React",
    "Next.js", "Angular", "Vue.js", "Vite", "Redux", "jQuery",
    "Responsive Design",
  ],
  "Backend Development": [
    "Node.js", "Express.js", "Django", "Django REST Framework", "Flask",
    "FastAPI", "Spring Boot", "Spring Framework", "ASP.NET Core",
    "Laravel", "Symfony", "Ruby on Rails", "NestJS", "Microservices",
  ],
  "API Development": [
    "REST API", "GraphQL", "WebSockets", "API Development",
    "API Integration", "JSON", "XML", "OAuth", "JWT", "OpenAPI",
    "API Documentation",
  ],
  "Relational Databases": [
    "SQL", "PostgreSQL", "MySQL", "SQLite", "Microsoft SQL Server",
    "Oracle Database", "MariaDB", "Database Design", "Query Optimization",
    "Database Indexing",
  ],
  "NoSQL and Caching": [
    "MongoDB", "Redis", "Elasticsearch", "DynamoDB", "Firebase",
    "Supabase", "Cassandra", "Caching", "Vector Databases",
  ],
  "Cloud and DevOps": [
    "AWS", "Microsoft Azure", "Google Cloud", "Docker", "Kubernetes",
    "Jenkins", "GitHub Actions", "GitLab CI/CD", "CI/CD", "Terraform",
    "Ansible", "Linux", "Nginx", "Apache", "Render", "Railway",
    "Vercel", "Netlify", "Monitoring", "Logging",
  ],
  "Version Control and Developer Tools": [
    "Git", "GitHub", "GitLab", "Bitbucket", "Postman", "Insomnia",
    "VS Code", "PyCharm", "Jira", "Confluence",
  ],
  "Testing and Quality": [
    "Unit Testing", "Integration Testing", "Pytest", "Unittest", "Jest",
    "React Testing Library", "Selenium", "Cypress", "Playwright",
    "Test Automation", "Debugging", "Code Review", "Agile", "Scrum",
  ],
  "Data and Analytics": [
    "NumPy", "Pandas", "Matplotlib", "Seaborn", "Plotly", "Excel",
    "Power BI", "Tableau", "ETL", "Data Cleaning", "Data Visualization",
    "Statistics", "Exploratory Data Analysis",
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

function getCandidateSkills(candidate, field) {
  return Array.isArray(candidate[field]) ? candidate[field] : [];
}

function getSkillGroup(skill) {
  for (const [group, skills] of Object.entries(SKILL_GROUPS)) {
    if (skills.includes(skill)) {
      return group;
    }
  }

  return "Other Skills";
}

function CandidateComparison({ candidates = [] }) {
  if (candidates.length < 2) {
    return null;
  }

  const requiredSkills = [
    ...new Set(
      candidates.flatMap((candidate) => [
        ...getCandidateSkills(candidate, "matched_skills"),
        ...getCandidateSkills(candidate, "missing_skills"),
      ])
    ),
  ];

  const allDetectedSkills = [
    ...new Set(
      candidates.flatMap((candidate) =>
        getCandidateSkills(candidate, "detected_skills")
      )
    ),
  ];

  const additionalSkills = [
    ...new Set(
      candidates.flatMap((candidate) =>
        getCandidateSkills(candidate, "additional_skills")
      )
    ),
  ];

  function renderStatus(candidate, skill) {
    const matched = getCandidateSkills(candidate, "matched_skills");
    const missing = getCandidateSkills(candidate, "missing_skills");

    if (matched.includes(skill)) {
      return <span className="comparison-present">Matched</span>;
    }

    if (missing.includes(skill)) {
      return <span className="comparison-absent">Missing</span>;
    }

    return <span className="comparison-neutral">Not required</span>;
  }

  function renderDetectedStatus(candidate, skill) {
    const detected = getCandidateSkills(candidate, "detected_skills");

    return detected.includes(skill) ? (
      <span className="comparison-present">Detected</span>
    ) : (
      <span className="comparison-absent">Not detected</span>
    );
  }

  function renderAdditionalStatus(candidate, skill) {
    const additional = getCandidateSkills(candidate, "additional_skills");

    return additional.includes(skill) ? (
      <span className="comparison-present">Yes</span>
    ) : (
      <span className="comparison-neutral">—</span>
    );
  }

  function renderSkillRows(skills, renderStatusForSkill) {
    const grouped = {};

    for (const skill of skills) {
      const group = getSkillGroup(skill);

      if (!grouped[group]) {
        grouped[group] = [];
      }

      grouped[group].push(skill);
    }

    return Object.entries(grouped).map(([group, groupSkills]) => (
      <React.Fragment key={group}>
        <tr className="comparison-group-row">
          <th colSpan={candidates.length + 1}>{group}</th>
        </tr>

        {groupSkills.map((skill) => (
          <tr key={`${group}-${skill}`}>
            <th>{skill}</th>

            {candidates.map((candidate, index) => (
              <td key={`${candidate.filename}-${skill}-${index}`}>
                {renderStatusForSkill(candidate, skill)}
              </td>
            ))}
          </tr>
        ))}
      </React.Fragment>
    ));
  }

  return (
    <section className="comparison-section">
      <div className="comparison-heading">
        <span className="eyebrow">SIDE-BY-SIDE ANALYSIS</span>
        <h2>Compare candidates</h2>
        <p>
          Compare job requirements, detected technologies, and additional
          skills without treating different technologies as interchangeable.
        </p>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Criteria</th>

              {candidates.map((candidate, index) => (
                <th key={`${candidate.filename}-${index}`}>
                  <div>{candidate.name || "Unknown candidate"}</div>
                  <small>{candidate.filename}</small>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>Match score</th>

              {candidates.map((candidate, index) => (
                <td key={`${candidate.filename}-score-${index}`}>
                  <strong className="comparison-score">
                    {Number(candidate.match_score ?? 0).toFixed(2)}%
                  </strong>
                </td>
              ))}
            </tr>

            <tr className="comparison-section-row">
              <th colSpan={candidates.length + 1}>
                Job Requirements
              </th>
            </tr>

            {renderSkillRows(requiredSkills, renderStatus)}

            <tr className="comparison-section-row">
              <th colSpan={candidates.length + 1}>
                All Detected Skills
              </th>
            </tr>

            {renderSkillRows(allDetectedSkills, renderDetectedStatus)}

            <tr className="comparison-section-row">
              <th colSpan={candidates.length + 1}>
                Additional Skills
              </th>
            </tr>

            {renderSkillRows(additionalSkills, renderAdditionalStatus)}
          </tbody>
        </table>
      </div>

      <p className="disclaimer">
        “Missing” and “Not detected” mean the screening system did not
        identify the requirement or skill in the resume. They do not prove
        the candidate lacks that skill. Review the original resumes before
        making hiring decisions.
      </p>
    </section>
  );
}

export default CandidateComparison;
