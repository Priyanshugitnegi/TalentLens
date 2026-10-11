
function DashboardStats({ results, failed }) {
  const totalResumes = results.length + failed.length;

  const averageScore =
    results.length > 0
      ? results.reduce(
          (total, candidate) => total + candidate.match_score,
          0
        ) / results.length
      : 0;

  const stats = [
    {
      label: "Resumes processed",
      value: totalResumes,
      icon: "📄",
    },
    {
      label: "Successful analyses",
      value: results.length,
      icon: "✓",
    },
    {
      label: "Average match",
      value: `${averageScore.toFixed(1)}%`,
      icon: "↗",
    },
    {
      label: "Failed analyses",
      value: failed.length,
      icon: "!",
    },
  ];

  return (
    <section className="dashboard-stats" aria-label="Screening statistics">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <div className="stat-icon">{stat.icon}</div>
          <p className="stat-label">{stat.label}</p>
          <h3 className="stat-value">{stat.value}</h3>
        </article>
      ))}
    </section>
  );
}

export default DashboardStats;
