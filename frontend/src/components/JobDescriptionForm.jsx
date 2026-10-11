
function JobDescriptionForm({
  jobTitle,
  setJobTitle,
  jobDescription,
  setJobDescription,
}) {
  return (
    <section className="panel">
      <div className="section-heading">
        <span className="step-number">01</span>
        <div>
          <h2>Job details</h2>
          <p>Tell us which role you're hiring for.</p>
        </div>
      </div>

      <label htmlFor="job-title">Job title</label>

      <input
        id="job-title"
        type="text"
        value={jobTitle}
        onChange={(event) => setJobTitle(event.target.value)}
        placeholder="Example: Python Backend Developer"
        maxLength={200}
        required
      />

      <label htmlFor="job-description">Job description</label>

      <textarea
        id="job-description"
        value={jobDescription}
        onChange={(event) => setJobDescription(event.target.value)}
        placeholder="Example: Python Backend Developer with Django, REST APIs, PostgreSQL, Docker and AWS..."
        rows={6}
        required
      />
    </section>
  );
}

export default JobDescriptionForm;
