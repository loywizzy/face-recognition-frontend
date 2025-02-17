import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  // ✅ ดึงข้อมูลนักศึกษา
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/students");
      setStudents(response.data);
      const initialAttendance = {};
      response.data.forEach((student) => {
        initialAttendance[student.id] = student.attendance || false; // ใช้รหัส นศ เป็น key
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // ✅ อัปเดตสถานะการเข้าเรียน
  const updateAttendance = async (studentId) => {
    try {
      const status = attendance[studentId]; // ค่าที่เลือก
      const date = new Date().toISOString().split("T")[0];

      await axios.post("http://localhost:5000/attendance", {
        studentId, // ใช้รหัส นศ
        attendance: status, // true หรือ false
        date,
      });

      Swal.fire("Success", `Attendance updated for ${studentId}!`, "success");
    } catch (error) {
      console.error("Error updating attendance:", error);
      Swal.fire("Error", "Something went wrong while updating attendance.", "error");
    }
  };

  // ✅ อัปเดตสถานะใน state
  const handleAttendanceChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status === "true" });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Check Attendance
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6">Student ID</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Attendance Status</th>
              <th className="py-3 px-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-100">
                <td className="py-4 px-6">{student.id}</td> {/* รหัส นศ */}
                <td className="py-4 px-6">
                  {student.firstName} {student.lastName}
                </td>
                <td className="py-4 px-6">
                  <select
                    value={attendance[student.id] ? "true" : "false"}
                    onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="true">Present</option>
                    <option value="false">Absent</option>
                  </select>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => updateAttendance(student.id)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Update
                  </button>
                </td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
