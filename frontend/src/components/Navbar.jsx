
function Navbar({ currentPage, onNavigate }) {
  return (
    <header className="topbar">
      <a
        className="brand"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          onNavigate("screening");
        }}
      >
        <span className="brand-icon">AI</span>
        <span>TalentLens</span>
      </a>

      <nav className="topbar-nav">
        <button
          type="button"
          className={`nav-link ${
            currentPage === "screening" ? "active" : ""
          }`}
          onClick={() => onNavigate("screening")}
        >
          Screen Resumes
        </button>

        <button
          type="button"
          className={`nav-link ${
            currentPage === "history" ? "active" : ""
          }`}
          onClick={() => onNavigate("history")}
        >
          <span aria-hidden="true">↺ </span>
          Screening History
        </button>
      </nav>

      <span className="topbar-label">AI RESUME SCREENING</span>
    </header>
  );
}

export default Navbar;
