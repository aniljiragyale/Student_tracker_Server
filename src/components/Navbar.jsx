import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">📘 Student Dashboard</div>
      <div className="navbar-links">
        
        <Link to="/register">New Student</Link>
        <Link to="/update-attendance">Update Attendance</Link>
        <Link to="/update-marks">Update Marks</Link>
        <Link to="/share">Share via Email</Link>
        <Link to="/">Logout</Link>

      </div>
    </nav>
  );
};

export default Navbar;
