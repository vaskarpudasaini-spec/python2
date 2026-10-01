"use client";

import { useState } from "react";

export default function AddStudentPage() {
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    className: "",
    section: "",
    guardianName: "",
    relationship: "",
    phone: "",
    email: "",
    academicYear: "2083",
    admissionDate: "",
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const requiredFields = [
    { value: formData.studentId, name: "Student ID" },
    { value: formData.fullName, name: "Full Name" },
    { value: formData.dateOfBirth, name: "Date of Birth" },
    { value: formData.gender, name: "Gender" },
    { value: formData.className, name: "Class" },
    { value: formData.section, name: "Section" },
    { value: formData.guardianName, name: "Guardian Name" },
    { value: formData.relationship, name: "Relationship" },
    { value: formData.phone, name: "Phone" },
    { value: formData.academicYear, name: "Academic Year" },
    { value: formData.admissionDate, name: "Admission Date" },
  ];

  const missingField = requiredFields.find(
    (field) => !field.value.trim()
  );

  if (missingField) {
    alert(`Please fill in ${missingField.name}.`);
    return;
  }

  const phoneRegex = /^9[678]\d{8}$/;

  if (!phoneRegex.test(formData.phone)) {
    alert("Please enter a valid Nepali mobile number.");
    return;
  }

const response = await fetch("/api/students", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(formData),
});

const result = await response.json();

if (!response.ok) {
  alert(result.error || "Failed to save student.");
  return;
}

alert(`Student ${result.fullName} saved successfully!`);

 
}
  

  return (
    <main className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            SchoolOS Nepal
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Add Student
          </h1>

          <p className="mt-2 text-gray-500">
            Register a new student in the school system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Student Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Student Information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Student ID
                </label>

                <input
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  type="text"
                  placeholder="STU-006"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter student's full name"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Date of Birth
                </label>

                <input
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  type="date"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Class
                </label>

                <select
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none"
                >
                  <option value="">Select class</option>
                  <option value="Nursery">Nursery</option>
                  <option value="KG">KG</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Section
                </label>

                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none"
                >
                  <option value="">Select section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

            </div>
          </section>

          {/* Guardian Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Guardian Information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Guardian Name
                </label>

                <input
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter guardian name"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Relationship
                </label>

                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none"
                >
                  <option value="">Select relationship</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="98XXXXXXXX"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="guardian@example.com"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

            </div>
          </section>

          {/* Academic Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Academic Information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Academic Year
                </label>

                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none"
                >
                  <option value="2083">2083</option>
                  <option value="2082">2082</option>
                  <option value="2081">2081</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Admission Date
                </label>

                <input
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleChange}
                  type="date"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

            </div>
          </section>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pb-8">

            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-xl border bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Save Student
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}