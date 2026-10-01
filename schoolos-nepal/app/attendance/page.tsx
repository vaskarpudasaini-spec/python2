"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  studentId: string;
  fullName: string;
  className: string;
  section: string;
};

type AttendanceStatus = "Present" | "Absent" | "Late";

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState<
    Record<number, AttendanceStatus>
  >({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await fetch("/api/students");
        const data = await response.json();

        if (response.ok) {
          setStudents(data);
        }
      } catch (error) {
        console.error("Error loading students:", error);
      }
    }

    loadStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    return (
      (!selectedClass || student.className === selectedClass) &&
      (!selectedSection || student.section === selectedSection)
    );
  });

  function markStudent(
    studentId: number,
    status: AttendanceStatus
  ) {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  }

  async function saveAttendance() {
    if (!selectedClass || !selectedSection) {
      alert("Please select class and section first.");
      return;
    }

    if (filteredStudents.length === 0) {
      alert("No students found for this class and section.");
      return;
    }

    setLoading(true);

    try {
      const records = filteredStudents.map((student) => ({
        studentId: student.id,
        date: selectedDate,
        status: attendance[student.id] || "Present",
      }));

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(records),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to save attendance.");
        return;
      }

      alert("Attendance saved successfully.");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Something went wrong while saving attendance.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Mark and manage daily student attendance.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* Class */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Class
              </label>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select Class</option>
                <option value="Nursery">Nursery</option>
                <option value="KG">KG</option>
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={String(index + 1)}>
                    Class {index + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Section
              </label>

              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select Section</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Student Attendance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredStudents.length} student
              {filteredStudents.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-500">
                Select a class and section to view students.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y">
                {filteredStudents.map((student) => {
                  const currentStatus =
                    attendance[student.id] || "Present";

                  return (
                    <div
                      key={student.id}
                      className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
                    >
                      {/* Student Information */}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {student.fullName}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {student.studentId} • Class {student.className}-
                          {student.section}
                        </p>
                      </div>

                      {/* Attendance Buttons */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            markStudent(student.id, "Present")
                          }
                          className={`rounded-lg px-4 py-2 text-sm font-medium ${
                            currentStatus === "Present"
                              ? "bg-green-600 text-white"
                              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            markStudent(student.id, "Absent")
                          }
                          className={`rounded-lg px-4 py-2 text-sm font-medium ${
                            currentStatus === "Absent"
                              ? "bg-red-600 text-white"
                              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Absent
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            markStudent(student.id, "Late")
                          }
                          className={`rounded-lg px-4 py-2 text-sm font-medium ${
                            currentStatus === "Late"
                              ? "bg-yellow-500 text-white"
                              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Save */}
              <div className="flex justify-end border-t bg-gray-50 px-6 py-5">
                <button
                  type="button"
                  onClick={saveAttendance}
                  disabled={loading}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Attendance"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}