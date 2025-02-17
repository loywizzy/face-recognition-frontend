import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';  // นำเข้า Dashboard
import StudentManagement from './components/StudentManagement';  // นำเข้า StudentManagement
import UpdateStudent from './components/UpdateStudent';  // นำเข้า UpdateStudent
import Attendance from './components/Attendance';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />  {/* หน้าแรกเป็น Dashboard */}
        <Route path="/student-management" element={<StudentManagement />} />  {/* หน้าเพิ่มนักศึกษา */}
        <Route path="/update-student/:id" element={<UpdateStudent />} />  {/* หน้าอัพเดตข้อมูลนักศึกษา */}
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </Router>
  );
}

export default App;
