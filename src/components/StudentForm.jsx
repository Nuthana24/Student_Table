import { useState, useEffect } from "react";

function StudentForm({ addStudent, editData, updateStudent }) {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    age: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editData) {
      setStudent(editData);
    }
  }, [editData]);

  const validate = () => {
    if (!student.name || !student.email || !student.age) {
      return "All fields are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student.email)) {
      return "Invalid email format";
    }

    if (student.age <= 0) {
      return "Age must be valid";
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    if (editData) {
      updateStudent(student);
    } else {
      addStudent(student);
    }

    setStudent({ name: "", email: "", age: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={student.name}
        onChange={(e) =>
          setStudent({ ...student, name: e.target.value })
        }
      />

      <input
        name="email"
        placeholder="Email"
        value={student.email}
        onChange={(e) =>
          setStudent({ ...student, email: e.target.value })
        }
      />

      <input
        name="age"
        placeholder="Age"
        type="number"
        value={student.age}
        onChange={(e) =>
          setStudent({ ...student, age: e.target.value })
        }
      />

      <button type="submit" className="add-btn">
  {editData ? "Update" : "Add"}
</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default StudentForm;