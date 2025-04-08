import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RegisterStudent from "./pages/RegisterStudent";
import UpdateAttendance from "./pages/UpdateAttendance";
import UpdateMarks from "./pages/UpdateMarks";
import SharePage from "./pages/SharePage";
import LoginPage from "./pages/Login";

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<RegisterStudent />} />
        <Route path="/update-attendance" element={<UpdateAttendance />} />
        <Route path="/update-marks" element={<UpdateMarks />} />
        <Route path="/share" element={<SharePage />} />
        

      </Routes>
    </Router>
  );
}

export default App;
