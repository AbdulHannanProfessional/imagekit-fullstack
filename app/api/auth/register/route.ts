import { connectDatabase } from "@/lib/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const {email, password} =await request.json()
        if(!email || !password) {
            return NextResponse.json({
            error: "email & password are required",
            status:404
        })
        }
        await connectDatabase()
       const existingUser = await User.findOne({email})
        if(existingUser ){
            return NextResponse.json({
                error: "User already registered",
                status: 404
            })
        }

        await User.create({
            email, password
        })
        return NextResponse.json({
            message: "User successfully registered",
            status: 200
        })
    } catch (err) {
        console.log("an error occured in try block", err)
         return NextResponse.json({
                error: err,
                status: 500
            })
    }
}