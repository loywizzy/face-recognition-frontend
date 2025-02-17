import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [id, setId] = useState('');
  const [image, setImage] = useState(null);

  // ฟังก์ชันดึงข้อมูลนักศึกษาจาก API
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // ฟังก์ชันเพิ่มนักศึกษาผ่าน API
  const addStudent = async () => {
    if (!id || !firstName || !lastName || !image) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all fields including the image!',
      });
      return;
    }
    if (id.length !== 10) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Student ID must be 10 characters.',
      });
      return;
    }
    const newStudent = { id, firstName, lastName, image, attendance: false }; // ตั้งค่า attendance เป็น false
    try {
      await axios.post('http://localhost:5000/students', newStudent);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Student added successfully!',
      });
      fetchStudents();
      setId('');
      setFirstName('');
      setLastName('');
      setImage(null);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  // ฟังก์ชันลบนักศึกษาผ่าน API
  const deleteStudent = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this student!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/students/${id}`);
          Swal.fire('Deleted!', 'Student has been deleted.', 'success');
          fetchStudents();
        } catch (error) {
          console.error('Error deleting student:', error);
          Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
        }
      }
    });
  };

  // ฟังก์ชันอัปโหลดรูปภาพ
  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  // ดึงข้อมูลนักศึกษาทุกครั้งที่หน้าเว็บโหลด
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Student Management</h1>

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Student</h2>
        <input
          type="text"
          placeholder="Student ID (10 digits)"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <button
          onClick={addStudent}
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add Student
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mb-6">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6">ID</th>
              <th className="py-3 px-6">First Name</th>
              <th className="py-3 px-6">Last Name</th>
              <th className="py-3 px-6">Image</th>
              <th className="py-3 px-6">Action</th>
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
                      src={student.image}
                      alt="Student"
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                </td>
                <td className="py-4 px-6">
                  <Link
                    to={`/update-student/${student.id}`}
                    className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => deleteStudent(student.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/">
        <button className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300">
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default StudentManagement;
