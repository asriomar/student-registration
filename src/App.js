import React, { useState, useEffect, useRef } from "react";

const initialData = [
  {
    _id: "1",
    studentId: "123",
    name: "Billy",
    pic: null,
    isEditing: false,
  },
  {
    _id: "2",
    studentId: "456",
    name: "Jane",
    pic: null,
    isEditing: false,
  },
  {
    _id: "3",
    studentId: "789",
    name: "Schdimt",
    pic: null,
    isEditing: false,
  },
  {
    _id: "4",
    studentId: "101",
    name: "Jonas",
    pic: null,
    isEditing: false,
  },
  // Add more initial data as needed
];

const StudentForm = ({ formData, onChange, onSubmit }) => {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onChange({ ...formData, pic: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      formData.studentId.trim() === "" ||
      formData.name.trim() === "" ||
      !formData.pic
    ) {
      alert("Please fill in all fields and upload a picture.");
      return;
    }

    onSubmit();

    // Clear the file input value
    fileInputRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-sm font-mono border border-2 border-gray-500 bg-gray-200 p-5 m-3 rounded-md shadow-lg"
    >
      <label>
        <p className="">Student ID:</p>
        <input
          type="text"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          readOnly={formData.isEditing}
        />
      </label>
      <br />
      <label>
        <p className="">Name:</p>
        <input
          className="w-full"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label className="">
        <p className="my-2 ">Picture:</p>
        <input
          className=" "
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </label>
      <br />
      <button className=" " type="submit">
        <p className="bg-blue-200 mt-5 px-2 py-1 rounded shadow-lg hover:bg-blue-300 border">
          {formData.isEditing ? "Save" : "Register"}
        </p>
      </button>
    </form>
  );
};

const StudentRegistrationForm = ({ formData, onChange, onSubmit }) => (
  <div className="md:w-1/3 p-3 mx-auto">
    <h1 className="text-blue-500 font-sans text-2xl text-center">
      Student Registration Form
    </h1>
    <StudentForm formData={formData} onChange={onChange} onSubmit={onSubmit} />
  </div>
);

const StudentEditForm = ({ student, onSubmit }) => {
  const [formData, setFormData] = useState({
    studentId: student.studentId,
    name: student.name,
    pic: student.pic,
    isEditing: true,
  });

  useEffect(() => {
    setFormData({
      studentId: student.studentId,
      name: student.name,
      pic: student.pic,
      isEditing: true,
    });
  }, [student]);

  return (
    <div>
      <h1>Edit Student</h1>
      <StudentForm
        formData={formData}
        onChange={setFormData}
        onSubmit={() => {
          onSubmit(formData);
          setFormData({ studentId: "", name: "", pic: null, isEditing: false });
        }}
      />
    </div>
  );
};

const StudentList = ({ students, onEdit, onDelete }) => (
  <ul>
    {students.map((student) => (
      <li key={student._id}>
        <div className="bg-yellow-100 p-3">
          <div>{`${student.name} (ID: ${student.studentId})`}</div>
          {student.pic && (
            <img
              src={URL.createObjectURL(student.pic)}
              alt={`Student ${student.studentId}`}
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          )}

          <button
            className="m-2 px-2 bg-yellow-200 rounded shadow-lg"
            onClick={() => onEdit(student._id)}
          >
            Edit
          </button>
          <button
            className="m-2 px-2 bg-red-400 rounded shadow-lg"
            onClick={() => onDelete(student._id)}
          >
            Delete
          </button>
          <hr />
          <hr />
          <hr />
        </div>
      </li>
    ))}
  </ul>
);

function App() {
  const [students, setStudents] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    pic: null,
    isEditing: false,
  });

  const handleRegistration = () => {
    const isDuplicate = students.some(
      (student) => student.studentId === formData.studentId
    );

    if (isDuplicate) {
      alert("Student with the same ID already exists.");
      return;
    }

    setStudents((prevStudents) => [
      ...prevStudents,
      { ...formData, _id: (prevStudents.length + 1).toString() },
    ]);
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      studentId: "",
      name: "",
      pic: null,
      isEditing: false,
    });
  };

  const handleEdit = (id) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === id
          ? { ...student, isEditing: true }
          : { ...student, isEditing: false }
      )
    );
  };

  const handleEditSave = (formData) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.isEditing ? { ...formData, _id: student._id } : student
      )
    );
    setStudents((prevStudents) =>
      prevStudents.map((student) => ({ ...student, isEditing: false }))
    );
  };

  const handleDelete = (id) => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student._id !== id)
    );
  };

  useEffect(() => {
    const filteredStudents = students.filter(
      (student) =>
        student.studentId.includes(searchTerm) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredStudents);
  }, [searchTerm, students]);

  return (
    <div className="font-mono">
      <StudentRegistrationForm
        formData={formData}
        onChange={setFormData}
        onSubmit={handleRegistration}
      />
      <div className="my-4 mx-8">
        <label>
          <p className=""> Search by Student ID or Name: </p>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      <div className="m-8">
        <h2 className="my-8 text-blue-600 font-semibold">Search Results</h2>

        {searchResults.length === 0 ? (
          <p className="text-red-500 font-semibold">No results found.</p>
        ) : (
          <div className="bg-gray-200 m-2 p-1 ">
            <StudentList
              students={searchResults}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>

      <hr />
      <hr />
      <hr />
      <hr />

      <div className="mx-8">
        <h2 className="my-8 text-blue-600 font-semibold">
          Registered Students
        </h2>
        <StudentList
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {students.some((student) => student.isEditing) && (
          <StudentEditForm
            student={students.find((student) => student.isEditing)}
            onSubmit={handleEditSave}
          />
        )}
      </div>
    </div>
  );
}

export default App;
