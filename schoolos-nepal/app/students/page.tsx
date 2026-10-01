import { prisma } from "@/lib/prisma";

type StudentsPageProps = {
  searchParams: Promise<{
    search?: string;
    className?: string;
    section?: string;
    status?: string;
  }>;
};

export default async function StudentsPage({
  searchParams,
}: StudentsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() || "";
  const className = params.className || "";
  const section = params.section || "";
  const status = params.status || "";

  // Get students for the current filters
  const students = await prisma.student.findMany({
    where: {
      ...(search
        ? {
            OR: [
              {
                fullName: {
                  contains: search,
                },
              },
              {
                studentId: {
                  contains: search,
                },
              },
            ],
          }
        : {}),

      ...(className
        ? {
            className,
          }
        : {}),

      ...(section
        ? {
            section,
          }
        : {}),

      ...(status
        ? {
            status,
          }
        : {}),
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  // Overall student statistics
  const totalStudents = await prisma.student.count();

  const activeStudents = await prisma.student.count({
    where: {
      status: "Active",
    },
  });

  const inactiveStudents = await prisma.student.count({
    where: {
      status: "Inactive",
    },
  });

  const newStudents = await prisma.student.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">
              SchoolOS Nepal
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Students
            </h1>

            <p className="mt-2 text-gray-500">
              Manage students, classes, sections and guardians.
            </p>
          </div>

          <a
            href="/students/add"
            className="rounded-xl bg-gray-900 px-5 py-3 text-center text-sm font-medium text-white hover:bg-gray-800"
          >
            + Add Student
          </a>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Students */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Students
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalStudents}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              All registered students
            </p>
          </div>

          {/* Active Students */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Active Students
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {activeStudents}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Currently active
            </p>
          </div>

          {/* Inactive Students */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Inactive Students
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {inactiveStudents}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Not currently active
            </p>
          </div>

          {/* New Students */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              New Students
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {newStudents}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Added in the last 30 days
            </p>
          </div>

        </div>

        {/* Filters */}
        <form
          method="GET"
          className="mt-8 rounded-2xl border bg-white p-4 shadow-sm"
        >
          <div className="grid gap-3 md:grid-cols-4">

            {/* Search */}
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search name or student ID..."
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            />

            {/* Class */}
            <select
              name="className"
              defaultValue={className}
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="">All Classes</option>
              <option value="10">Class 10</option>
              <option value="9">Class 9</option>
              <option value="8">Class 8</option>
              <option value="7">Class 7</option>
            </select>

            {/* Section */}
            <select
              name="section"
              defaultValue={section}
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>

            {/* Status */}
            <select
              name="status"
              defaultValue={status}
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

          </div>

          {/* Filter Buttons */}
          <div className="mt-4 flex gap-3">

            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Apply Filters
            </button>

            <a
              href="/students"
              className="rounded-xl border px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </a>

          </div>
        </form>

        {/* Student Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">

          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-gray-900">
              Student Directory
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {students.length} students found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="border-b bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">
                    Student
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Class
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Guardian
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Phone
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">

                {students.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center"
                    >
                      <p className="font-medium text-gray-900">
                        No students found
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.fullName}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {student.studentId}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {student.className} - {student.section}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {student.guardianName}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {student.phone}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            student.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <a
                          href={`/students/${student.id}`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          View
                        </a>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>
          </div>

        </div>

      </div>
    </main>
  );
}