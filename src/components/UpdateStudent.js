import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const UpdateStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/students/${id}`);
        const { firstName, lastName, image } = response.data;
        setStudent(response.data);
        setFirstName(firstName);
        setLastName(lastName);
        setImage(image);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudent();
  }, [id]);

  const updateStudent = async () => {
    // สร้าง FormData เพื่ออัปโหลดข้อมูลแบบ multipart
    const formData = new FormData();
    formData.append('id', id);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    
    if (image) {
      formData.append('image', image); // เพิ่มไฟล์รูปภาพถ้ามี
    }
  
    try {
      // ส่งคำขอ PUT โดยใช้ FormData
      await axios.put(`http://localhost:5000/students/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // ระบุชนิดข้อมูลเป็น multipart
        },
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Student updated successfully!',
      });
      
      navigate("/"); // ไปที่หน้า StudentManagement หลังจากอัปเดต
    } catch (error) {
      console.error("Error updating student:", error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Update!',
        text: 'Something went wrong. Please try again.',
      });
    }
  };
  

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Update Student
      </h1>

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <input
          type="text"
          value={id}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          disabled
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <button
          onClick={updateStudent}
          className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
        >
          Update Student
        </button>
      </div>
    </div>
  );
};

export default UpdateStudent;
