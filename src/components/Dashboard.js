import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0 });

  // ดึงข้อมูลนักศึกษา
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/students');
      setStudents(response.data);
      calculateAttendance(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // คำนวณจำนวนการมาหรือขาด
  const calculateAttendance = (studentsData) => {
    const presentCount = studentsData.filter(student => student.attendanceStatus === 'Present').length;
    const absentCount = studentsData.length - presentCount;
    setAttendanceStats({ present: presentCount, absent: absentCount });
  };

  useEffect(() => {
    fetchStudents();
  }, []); 
  
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Dashboard</h1>

      <div className="flex justify-center space-x-6 mb-6">
        <div className="text-center bg-white p-4 shadow-md rounded-lg w-48">
          <h2 className="text-xl font-semibold">Total Students</h2>
          <p className="text-3xl">{students.length}</p>
        </div>

        <div className="text-center bg-white p-4 shadow-md rounded-lg w-48">
          <h2 className="text-xl font-semibold">Present</h2>
          <p className="text-3xl">0000</p>
        </div>

        <div className="text-center bg-white p-4 shadow-md rounded-lg w-48">
          <h2 className="text-xl font-semibold">Absent</h2>
          <p className="text-3xl">0000</p>
        </div>
      </div>

      <div className="flex justify-center space-x-6 h-auto">
        <Link to="/student-management" className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
          Add Student
        </Link>
      </div>

      <br />
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Student List</h2>
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6">ID</th>
              <th className="py-3 px-6">First Name</th>
              <th className="py-3 px-6">Last Name</th>
              <th className="py-3 px-6">Image</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-100">
                <td className="py-4 px-6">{student.id}</td>
                <td className="py-4 px-6">{student.firstName}</td>
                <td className="py-4 px-6">{student.lastName}</td>
                <td className="py-4 px-6">
                  {student.image && (
                    <img
                    src={`http://localhost:5000${student.image}`} // ดึงรูปภาพจากเซิร์ฟเวอร์
                    alt="Student"
                    className="w-12 h-12 rounded-full"
                  />
                )}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
