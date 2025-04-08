import { useState } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import "../styles/Login.css";

const Login = () => {
  const [companyCode, setCompanyCode] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const trimmedCode = companyCode.trim().toUpperCase(); // Ensure no extra space and match Firestore ID case
      console.log("🔍 Trying to log in with:", `"${trimmedCode}"`, "| Length:", trimmedCode.length);

      // Reference to document: CorporateClient/<companyCode>
      const companyDocRef = doc(db, "CorporateClient", trimmedCode);
      const companySnap = await getDoc(companyDocRef);

      if (companySnap.exists()) {
        console.log("✅ Valid company code:", trimmedCode);
        localStorage.setItem("companyCode", trimmedCode);
        navigate("/register", { state: { companyCode: trimmedCode } });
      } else {
        console.warn("❌ Invalid company code:", trimmedCode);
        alert("Invalid Company Code. Please try again.");
      }
    } catch (error) {
      console.error("🔥 Login error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="container">
      {/* Left Branding Section */}
      <div className="left-side">
        <h1><span>Empower</span> Learning,<br /><span>Accelerate</span> Careers</h1>
        <div className="left-feature-boxes">
          <div className="feature-box">
            <h3>Smart Learning ✨</h3>
            <p>Build real-world skills through curated online modules and hands-on projects</p>
          </div>
          <div className="feature-box">
            <h3>Career Launch ✨</h3>
            <p>Unlock career opportunities with our expert-guided placement support</p>
          </div>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="right-side">
        <div className="login-container">
          <h2>Login / Signup</h2>
          <p>Enter your company code to continue your learning journey</p>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Enter Company Code"
              value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value)}
              required
            />
            <button type="submit">Continue</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
