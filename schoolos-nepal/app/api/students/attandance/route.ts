import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const records = await request.json();

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: "No attendance records were provided." },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      records.map((record) =>
        prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId: Number(record.studentId),
              date: String(record.date),
            },
          },
          update: {
            status: String(record.status),
          },
          create: {
            studentId: Number(record.studentId),
            date: String(record.date),
            status: String(record.status),
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: "Attendance saved successfully.",
        records: results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving attendance:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save attendance.",
      },
      { status: 500 }
    );
  }
}