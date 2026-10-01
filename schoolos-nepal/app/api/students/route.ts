import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      where: {
        status: "Active",
      },
      orderBy: {
        fullName: "asc",
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);

    return NextResponse.json(
      { error: "Failed to fetch students." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const existingStudent = await prisma.student.findUnique({
      where: {
        studentId: body.studentId,
      },
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          error: `Student ID ${body.studentId} already exists. Please use a different Student ID.`,
        },
        { status: 409 }
      );
    }

    const student = await prisma.student.create({
      data: {
        studentId: body.studentId,
        fullName: body.fullName,
        dateOfBirth: body.dateOfBirth,
        gender: body.gender,
        className: body.className,
        section: body.section,
        guardianName: body.guardianName,
        relationship: body.relationship,
        phone: body.phone,
        email: body.email || null,
        academicYear: body.academicYear,
        admissionDate: body.admissionDate,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save student.",
      },
      { status: 500 }
    );
  }
}