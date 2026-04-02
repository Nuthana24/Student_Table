function StudentTable({ students, deleteStudent, setEditData }) {
  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Age</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="4">No Students Found</td>
          </tr>
        ) : (
          students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.age}</td>
              <td>
  <button
    className="edit-btn"
    onClick={() => setEditData(s)}
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() => deleteStudent(s.id)}
  >
    Delete
  </button>
</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default StudentTable;