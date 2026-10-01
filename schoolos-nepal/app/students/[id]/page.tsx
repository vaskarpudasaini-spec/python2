import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DeactivateButton from "./DeactivateButton";


async function deactivateStudent(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.student.update({
    where: {
      id,
    },
    data: {
      status: "Inactive",
    },
  });

  revalidatePath("/students");
  revalidatePath(`/students/${id}`);

  redirect(`/students/${id}`);
}

export default async function StudentProfilePage({
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
              The student you are looking for does not exist.
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
      <div className="mx-auto max-w-5xl">

        <a
          href="/students"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Students
        </a>

        {/* Profile Header */}
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Student Profile
              </p>

              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                {student.fullName}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Student ID: {student.studentId}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              {/* Edit Button */}
              <a
                href={`/students/${student.id}/edit`}
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Edit Student
              </a>

              {/* Status Badge */}
              <span
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  student.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {student.status}
              </span>

            </div>
          </div>

          {/* Deactivate Action */}
          {student.status === "Active" && (
            <div className="mt-6 border-t pt-5">

              <DeactivateButton
  action={deactivateStudent}
  studentId={student.id}
/>
              <p className="mt-2 text-xs text-gray-500">
                This will mark the student as inactive without deleting their records.
              </p>

            </div>
          )}

          {student.status === "Inactive" && (
            <div className="mt-6 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
              This student is currently inactive.
            </div>
          )}
        </div>

        {/* Academic and Guardian Information */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">

          {/* Academic Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Academic Information
            </h2>

            <div className="mt-5 space-y-4">

              <div>
                <p className="text-xs text-gray-500">
                  Class
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {student.className}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Section
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {student.section}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Student ID
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {student.studentId}
                </p>
              </div>

            </div>
          </section>

          {/* Guardian Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Guardian Information
            </h2>

            <div className="mt-5 space-y-4">

              <div>
                <p className="text-xs text-gray-500">
                  Guardian Name
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {student.guardianName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Phone
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {student.phone}
                </p>
              </div>

            </div>
          </section>

        </div>

        {/* SchoolOS Modules */}
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            SchoolOS Modules
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            More student information will appear here as we build
            attendance, fees, notices and documents.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border p-4">
              <p className="font-medium text-gray-900">
                Attendance
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Coming next
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="font-medium text-gray-900">
                Fees
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Coming next
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="font-medium text-gray-900">
                Notices
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Coming next
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="font-medium text-gray-900">
                Documents
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Coming next
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}