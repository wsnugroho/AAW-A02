import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⚠️</span>
        <span className="brand-name">LabGuard</span>
        <span className="brand-tag">Event-Driven</span>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link" activeProps={{ className: "nav-link active" }}>
          Dashboard
        </Link>
        <Link to="/incidents" className="nav-link" activeProps={{ className: "nav-link active" }}>
          Incidents
        </Link>
        <Link to="/incidents/new" className="nav-link nav-link-cta" activeProps={{ className: "nav-link nav-link-cta active" }}>
          + Report
        </Link>
      </div>
    </nav>
  );
}
