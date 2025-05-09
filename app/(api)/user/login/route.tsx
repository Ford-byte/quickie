import { NextResponse } from "next/server";
import { query } from "../../config/route";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface USER {
  username: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    const data: USER = await request.json();

    if (!data.username || !data.password) {
      return NextResponse.json({
        status: 400,
        message: "Username and password are required",
      });
    }

    const result = await query("SELECT password FROM user WHERE username = ?", [
      data.username,
    ]);

    if (!result[0]) {
      return NextResponse.json({
        status: 400,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      result[0].password
    );

    if (!isPasswordValid) {
      return NextResponse.json({
        status: 400,
        message: "Password is incorrect",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ username: data.username }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return NextResponse.json({
      status: 200,
      message: "Login Successfully",
      token,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
