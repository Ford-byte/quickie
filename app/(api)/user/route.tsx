import { NextResponse } from "next/server";
import { query } from "../config/route";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const results = await query("SELECT * FROM user", []);
    return NextResponse.json({
      message: "Success",
      data: results,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Error",
      message: error.message,
    });
  }
}

interface USER {
  username: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const data: USER = await request.json();

    if (!data.username || !data.password) {
      return NextResponse.json({
        status: 400,
        message: "Field is required",
      });
    }

    const hashPassword = await bcrypt.hash(data.password, 10);

    const results = await query(
      "INSERT INTO user(username, password) VALUES (?, ?)",
      [data.username, hashPassword]
    );

    if (!results) {
      return NextResponse.json({
        status: 400,
        message: "Failed to create user",
      });
    }

    return NextResponse.json({
      status: 201,
      message: "User created successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Error",
      message: error.message,
    });
  }
}
