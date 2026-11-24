import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addStudent,
  updateStudent,
  deleteStudent,
} from "./store";
import "./index.css";

function App() {
  const dispatch = useDispatch();

  const students = useSelector(
    (state) => state.students.students
  );

  const [form, setForm] = useState({
    studentId: "",
    name: "",
    department: "",
    semester: "",
    section: "",
    email: "",
  });

  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.studentId.trim() ||
      !form.name.trim() ||
      !form.department ||
      !form.semester ||
      !form.section.trim() ||
      !form.email.trim()
    ) {
      setMessage("Please fill all fields.");
      return;
    }

    const duplicate = students.some(
      (student) =>
        student.studentId === form.studentId.trim() &&
        (!editing || student.studentId !== form.studentId)
    );

    if (duplicate) {
      setMessage("Student ID already exists!");
      return;
    }

    const studentData = {
      ...form,
      studentId: form.studentId.trim(),
      name: form.name.trim(),
      section: form.section.trim(),
      email: form.email.trim(),
    };

    if (editing) {
      dispatch(updateStudent(studentData));
      setMessage("Student updated successfully!");
    } else {
      dispatch(addStudent(studentData));
      setMessage("Student added successfully!");
    }

    setForm({
      studentId: "",
      name: "",
      department: "",
      semester: "",
      section: "",
      email: "",
    });

    setEditing(false);
  };

  const handleEdit = (student) => {
    setForm({ ...student });
    setEditing(true);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this student?")) {
      dispatch(deleteStudent(id));
      setMessage("Student deleted successfully!");

      if (editing && form.studentId === id) {
        setEditing(false);
        setForm({
          studentId: "",
          name: "",
          department: "",
          semester: "",
          section: "",
          email: "",
        });
      }
    }
  };

  const filteredStudents = students.filter((student) =>
    [
      student.studentId,
      student.name,
      student.department,
      student.email,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <div>
          <span className="brand">ATTENDLY</span>
          <h1>Student Management</h1>
          <p>Manage your students in one place.</p>
        </div>

        <div className="header-icon">🎓</div>
      </header>

      <main className="container">

        <section className="stats">
          <div className="stat-card">
            <span>Total Students</span>
            <h2>{students.length}</h2>
          </div>

          <div className="stat-card">
            <span>Departments</span>
            <h2>
              {new Set(
                students.map((s) => s.department)
              ).size}
            </h2>
          </div>

          <div className="stat-card">
            <span>Registered Students</span>
            <h2>{students.length}</h2>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>{editing ? "Edit Student" : "Add New Student"}</h2>
              <p>Enter student information below.</p>
            </div>
            <span className="badge">STUDENT FORM</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="field">
                <label>Student ID</label>
                <input
                  name="studentId"
                  placeholder="Enter student ID"
                  value={form.studentId}
                  onChange={handleChange}
                  disabled={editing}
                />
              </div>

              <div className="field">
                <label>Full Name</label>
                <input
                  name="name"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Department</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Commerce">Commerce</option>
                </select>
              </div>

              <div className="field">
                <label>Semester</label>
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      Semester {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Section</label>
                <input
                  name="section"
                  placeholder="Example: A"
                  value={form.section}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="student@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

            </div>

            {message && (
              <div className="message">{message}</div>
            )}

            <div className="form-actions">
              <button className="primary-btn" type="submit">
                {editing ? "Update Student" : "+ Add Student"}
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setEditing(false);
                  setMessage("");
                  setForm({
                    studentId: "",
                    name: "",
                    department: "",
                    semester: "",
                    section: "",
                    email: "",
                  });
                }}
              >
                Clear Form
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Student Directory</h2>
              <p>View and manage registered students.</p>
            </div>
            <span className="count">{filteredStudents.length} Students</span>
          </div>

          <input
            className="search"
            placeholder="🔍 Search by ID, name, department or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Section</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.studentId}>
                      <td>{student.studentId}</td>
                      <td className="student-name">
                        {student.name}
                      </td>
                      <td>{student.department}</td>
                      <td>{student.semester}</td>
                      <td>{student.section}</td>
                      <td>{student.email}</td>
                      <td>
                        <div className="actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(student)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(student.studentId)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty">
                      No students found. Add your first student!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      <footer>
        Attendly Student Management System · Powered by Redux Toolkit
      </footer>
    </div>
  );
}

export default App;