"use client";

import { useState } from "react";

export default function DeactivateButton({
  action,
  studentId,
}: {
  action: (formData: FormData) => void;
  studentId: number;
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!showConfirm) {
    return (
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="cursor-pointer rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Deactivate Student
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-red-800">
          Deactivate this student?
        </p>

        <p className="mt-1 text-xs text-red-700">
          The student will become inactive, but their records will not be
          deleted.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          className="cursor-pointer rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <form action={action}>
          <input
            type="hidden"
            name="id"
            value={studentId}
          />

          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Yes, Deactivate
          </button>
        </form>
      </div>
    </div>
  );
}