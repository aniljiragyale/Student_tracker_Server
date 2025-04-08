import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/UpdateAttendance.css";
import Navbar from "../components/Navbar";

const UpdateAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [companyCode, setCompanyCode] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedCode = localStorage.getItem("companyCode");

    if (!storedCode) {
      alert("Company not found. Please login again.");
      navigate("/");
      return;
    }

    setCompanyCode(storedCode);
  }, [navigate]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!companyCode) return;

      try {
        const studentsRef = collection(
          db,
          `CorporateClient/${companyCode}/studentinfo`
        );
        const querySnapshot = await getDocs(query(studentsRef));
        const studentList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentList);

        const defaultStatus = {};
        studentList.forEach((student) => {
          defaultStatus[student.id] = "Present";
        });
        setAttendanceMap(defaultStatus);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [companyCode]);

  const toggleStatus = (id) => {
    setAttendanceMap((prev) => {
      const current = prev[id];
      let nextStatus = "Present";
      if (current === "Present") nextStatus = "Absent";
      else if (current === "Absent") nextStatus = "Late Came";
      else if (current === "Late Came") nextStatus = "Present";

      return { ...prev, [id]: nextStatus };
    });
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    const newAttendanceMap = {};
    students.forEach((student) => {
      newAttendanceMap[student.id] = "Present";
    });
    setAttendanceMap(newAttendanceMap);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) return alert("Please select a date!");

    try {
      for (const student of students) {
        const studentRef = doc(
          db,
          `CorporateClient/${companyCode}/studentinfo`,
          student.id
        );
        await updateDoc(studentRef, {
          [`attendance.${selectedDate}`]: attendanceMap[student.id],
        });
      }

      alert("Attendance updated successfully!");
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance.");
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit} className="update-attendance-container">
        <h2>Update Attendance</h2>
        <label>Select Date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          required
        />

        <table className="update-attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status (Click to Toggle)</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name || "-"}</td>
                <td>{student.email}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => toggleStatus(student.id)}
                    className={`attendance-btn ${
                      attendanceMap[student.id] === "Present"
                        ? "present"
                        : attendanceMap[student.id] === "Absent"
                        ? "absent"
                        : "late"
                    }`}
                  >
                    {attendanceMap[student.id]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit">Save Attendance</button>
      </form>
    </>
  );
};

export default UpdateAttendance;