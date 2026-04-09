import { useState, useEffect } from "react";
import API from "./api";
import { motion } from "framer-motion";
import "./App.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
const [activities, setActivities] = useState(() => {
  const saved = localStorage.getItem("activities");
  return saved ? JSON.parse(saved) : [];
});
  // Fetch data
  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
  localStorage.setItem("activities", JSON.stringify(activities));
}, [activities]);

  const fetchStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data);
  };

  // Filter
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  // Submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.email || !form.age) return;

  if (editId) {
    await API.put(`/students/${editId}`, data);
    addActivity("updated", form.name); // ✅ log update
    setEditId(null);
  } else {
    await API.post("/students", form);
    addActivity("added", form.name); // ✅ log add
  }

  setForm({ name: "", email: "", age: "" });
  fetchStudents();
};

  // Delete
  const handleDelete = async (id) => {
  const student = students.find((s) => s.id === id);

  if (window.confirm("Delete this student?")) {
    await API.delete(`/students/${id}`);
    addActivity("deleted", student?.name || "Unknown"); // ✅ log delete
    fetchStudents();
  }
};

  // Edit
  const handleEdit = (student) => {
    setForm({
  name: student.name,
  email: student.email,
  age: student.age,
});
    setEditId(student.id);
  };

  // Select
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  // Export
  const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), fileName);
  };

  // Bulk delete
  const deleteSelected = async () => {
  for (let id of selectedIds) {
    const student = students.find((s) => s.id === id);
    await API.delete(`/students/${id}`);
    addActivity("deleted", student?.name || "Unknown");
  }

  setSelectedIds([]);
  fetchStudents();
};
  const ageGroups = [
  { label: "20-21", min: 20, max: 21, count: 0 },
  { label: "22-23", min: 22, max: 23, count: 0 },
  { label: "24-25", min: 24, max: 25, count: 0 },
  { label: "26-27", min: 26, max: 27, count: 0 },
  { label: "28-29", min: 28, max: 29, count: 0 },
];

// Count students in each range
students.forEach((s) => {
  const age = Number(s.age);

  ageGroups.forEach((group) => {
    if (age >= group.min && age <= group.max) {
      group.count++;
    }
  });
});
const addActivity = (type, name) => {
  const newActivity = {
    id: Date.now(),
    type,
    name,
    time: new Date().toLocaleTimeString(),
  };

  setActivities((prev) => [newActivity, ...prev].slice(0, 10)); // keep last 10
};

  return (
    <div className="dashboard">
      <div className="left-panel">
        <h1 className="title">🎓 Student Management</h1>

        {/* STATS SECTION */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-top">
              <span>👥</span>
              <p>Total Students</p>
            </div>
            <div className="stat-bottom">
  <div className="custom-icon"></div>
  <h2>{students.length}</h2>
</div>
          </div>

          {/* AVG */}
<div className="stat-card">
  <div className="stat-top">
    <span className="icon-small">📊</span>
    <p>Avg Age</p>
  </div>

  <div className="stat-bottom">
    {/* Custom colorful chart icon */}
    <div className="avg-icon-custom">
      <div className="pie"></div>
      <div className="bars"></div>
    </div>

    <h2>
      {students.length > 0
        ? (
            students.reduce((sum, s) => sum + Number(s.age), 0) /
            students.length
          ).toFixed(1)
        : 0}
    </h2>
  </div>
</div>

          <div className="stat-card youngest-card">
  <div className="stat-top">
    <span className="icon-small">✨</span>
    <p>Youngest</p>
  </div>

  <div className="stat-bottom">
    {/* BIG ICON instead of name */}
    <div className="big-icon youngest-big">📈</div>

    <h2>
      {students.length > 0
        ? `(${Math.min(...students.map((s) => s.age))})`
        : "(0)"}
    </h2>
  </div>

  {/* BACKGROUND ICON */}
  <div className="bg-icon youngest-bg">🌱</div>
</div>

          <div className="stat-card oldest-card">
  <div className="stat-top">
    <span className="icon-small">👑</span>
    <p>Oldest</p>
  </div>

  <div className="stat-bottom">
    {/* BIG ICON instead of name */}
    <div className="big-icon oldest-big">📉</div>

    <h2>
      {students.length > 0
        ? `(${Math.max(...students.map((s) => s.age))})`
        : "(0)"}
    </h2>
  </div>

  {/* BACKGROUND ICON */}
  <div className="bg-icon oldest-bg">🔥</div>
</div>
        </div>

        {/* MAIN BODY FLEX CONTAINER */}
        <div className="main-body-content" style={{ display: "flex", gap: "20px" }}>
          
          {/* LEFT COLUMN: FORM + SEARCH + TABLE */}
          <div className="content-column" style={{ flex: "2" }}>
            <form className="card form" onSubmit={handleSubmit}>
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
              <button className="btn primary">
                {editId ? "Update" : "Add"}
              </button>
            </form>

            <div className="search-wrapper">
              <div className="table-title">📊 Student Table</div>
              <input
                className="search-input"
                placeholder="🔍 Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="student-count">
  Total Student: {filteredStudents.length}
</div>
            </div>

            <div className="export-container">
              <button
                className="btn export"
                onClick={() => exportToExcel(students, "all_students.xlsx")}
              >
                ⬇ Download Full Data
              </button>
              <button
                className="btn export"
                onClick={() =>
                  exportToExcel(filteredStudents, "filtered_students.xlsx")
                }
              >
                ⬇ Download Filtered Data
              </button>
            </div>

            {selectedIds.length > 0 && (
              <div className="bulk-actions" style={{ marginBottom: "10px" }}>
                <span className="selected-badge">🟡 {selectedIds.length} selected</span>
                <button className="btn delete" onClick={deleteSelected}>
                  Delete Selected
                </button>
              </div>
            )}

            <div className="card table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          filteredStudents.length > 0 &&
                          selectedIds.length === filteredStudents.length
                        }
                      />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(s.id)}
                          onChange={() => handleSelect(s.id)}
                        />
                      </td>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.age}</td>
                      <td>
                        <button className="btn edit" onClick={() => handleEdit(s)}>Edit</button>
                        <button className="btn delete" onClick={() => handleDelete(s.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN: CHART + ACTIVITY */}
          <div className="right-panel" style={{ flex: "1", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="card chart-card">
  <h3>Students by Age</h3>

  <div
    className="chart"
    style={{
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      height: "180px",
      gap: "15px"
    }}
  >
    {ageGroups.map((group, index) => (
      <div
        key={index}
        className="bar-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1
        }}
      >
        <div
          className="bar"
          style={{
            height: `${group.count * 30}px`,
            width: "100%",
            maxWidth: "40px",
            background: "linear-gradient(to top, #6a11cb, #2575fc)",
            borderRadius: "6px",
            transition: "0.3s"
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        ></div>

        {/* Count */}
        <span style={{ fontSize: "12px", marginTop: "5px" }}>
          {group.count}
        </span>

        {/* Range Label */}
        <span style={{ fontSize: "11px", opacity: 0.7 }}>
          {group.label}
        </span>
      </div>
    ))}
  </div>
</div>

            <div className="card activity-card">
  <h3>Activity</h3>

  <ul style={{ listStyle: "none", padding: 0 }}>
    {activities.length === 0 && (
      <li style={{ opacity: 0.6 }}>No activity yet</li>
    )}

    {activities.map((a) => (
      <li
        key={a.id}
        className={
          a.type === "added"
            ? "green"
            : a.type === "updated"
            ? "yellow"
            : "red"
        }
        style={{ marginBottom: "10px" }}
      >
        {a.type === "added" && "🟢"}
        {a.type === "updated" && "🟡"}
        {a.type === "deleted" && "🔴"}{" "}
        
        {a.type.charAt(0).toUpperCase() + a.type.slice(1)}{" "}
        <strong>{a.name}</strong>

        <span style={{ fontSize: "11px", marginLeft: "8px", opacity: 0.6 }}>
          ({a.time})
        </span>
      </li>
    ))}
  </ul>
</div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
