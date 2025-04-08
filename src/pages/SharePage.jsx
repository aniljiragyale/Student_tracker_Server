import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import "../styles/SharePage.css";
import Navbar from "../components/Navbar";

const SharePage = () => {
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState([]);
  const companyCode = localStorage.getItem("companyCode"); // Now using the correct key

  const getToday = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayFormatted = getToday();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, "CorporateClient", companyCode, "studentinfo");
        const snapshot = await getDocs(studentsRef);

        const studentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched students:", studentList);
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [companyCode]);

  const handleShare = (e) => {
    e.preventDefault();

    const tableHeader = `
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>#</th>
            <th>Name</th>
            <th>Status on ${todayFormatted}</th>
            <th>Days Present</th>
            <th>Days Absent</th>
            <th>Days Late</th>
          </tr>
        </thead>
        <tbody>
    `;

    const tableRows = students
      .map((student, index) => {
        const attendance = student.attendance || {};
        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;

        Object.values(attendance).forEach((status) => {
          if (status === "Present") presentCount++;
          else if (status === "Absent") absentCount++;
          else if (status === "Late Came") lateCount++;
        });

        const todayStatus = attendance[todayFormatted] || "N/A";

        return `
          <tr>
            <td>${index + 1}</td>
            <td>${student.name || student.studentName || "N/A"}</td>
            <td>${todayStatus}</td>
            <td>${presentCount}</td>
            <td>${absentCount}</td>
            <td>${lateCount}</td>
          </tr>
        `;
      })
      .join("");

    const tableFooter = `
        </tbody>
      </table>
    `;

    const messageHtml = `
      <div style="font-family: Arial, sans-serif; font-size: 14px;">
        <p>Hello,</p>
        <p>Here is the <strong>student attendance summary</strong> for <strong>${companyCode}</strong> on <strong>${todayFormatted}</strong>:</p>
        ${tableHeader + tableRows + tableFooter}
        <p>Regards,<br/>Team</p>
      </div>
    `;

    console.log("Generated Email HTML:", messageHtml);

    const templateParams = {
      to_email: email,
      message: messageHtml,
    };

    emailjs
      .send(
        "service_jbps4bn",
        "template_wipt9rg",
        templateParams,
        "OGVGrLXoQYAfmldzC"
      )
      .then(
        () => {
          alert("Email sent successfully!");
          setEmail("");
        },
        (error) => {
          console.error("Email sending failed:", error);
          alert("Failed to send email.");
        }
      );
  };

  return (
    <>
      <Navbar />
      <div className="share-page">
        <h2>📤 Share Student Attendance via Email</h2>
        <form onSubmit={handleShare} className="share-form">
          <input
            type="email"
            placeholder="Enter recipient's email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Email</button>
        </form>
      </div>
    </>
  );
};

export default SharePage;
