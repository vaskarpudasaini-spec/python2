import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


async function updateStudent(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  const fullName = String(formData.get("fullName"));
  const studentId = String(formData.get("studentId"));
  const className = String(formData.get("className"));
  const section = String(formData.get("section"));
  const guardianName = String(formData.get("guardianName"));
  const phone = String(formData.get("phone"));
  const status = String(formData.get("status"));

  await prisma.student.update({
    where: {
      id,
    },
    data: {
      fullName,
      studentId,
      className,
      section,
      guardianName,
      phone,
      status,
    },
  });

  revalidatePath("/students");
  revalidatePath(`/students/${id}`);

  redirect(`/students/${id}`);
}

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studentId = Number(id);

  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Student Not Found
            </h1>

            <p className="mt-2 text-gray-500">
              The student you are trying to edit does not exist.
            </p>

            <a
              href="/students"
              className="mt-6 inline-block rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white"
            >
              ← Back to Students
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">

        <a
          href={`/students/${student.id}`}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Student Profile
        </a>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">

          <div>
            <p className="text-sm text-gray-500">
              SchoolOS Nepal
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Edit Student
            </h1>

            <p className="mt-2 text-gray-500">
              Update the student's information below.
            </p>
          </div>

          <form action={updateStudent} className="mt-8 space-y-6">

            <input
              type="hidden"
              name="id"
              value={student.id}
            />

            {/* Student Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Student Information
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    defaultValue={student.fullName}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Student ID
                  </label>

                  <input
                    type="text"
                    name="studentId"
                    defaultValue={student.studentId}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Class
                  </label>

                  <input
                    type="text"
                    name="className"
                    defaultValue={student.className}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Section
                  </label>

                  <input
                    type="text"
                    name="section"
                    defaultValue={student.section}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

              </div>
            </div>

            {/* Guardian Information */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Guardian Information
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Guardian Name
                  </label>

                  <input
                    type="text"
                    name="guardianName"
                    defaultValue={student.guardianName}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    defaultValue={student.phone}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

              </div>
            </div>

            {/* Status */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Status
              </h2>

              <select
                name="status"
                defaultValue={student.status}
                className="mt-4 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200 md:w-1/2"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">

              <a
                href={`/students/${student.id}`}
                className="rounded-xl border px-5 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </a>

              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Save Changes
              </button>

            </div>

          </form>

        </div>

      </div>
    </main>
  );
}