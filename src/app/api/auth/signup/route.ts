import { NextResponse } from "next/server";
import User from "@/app/models/user";
import { connect } from "@/app/libs/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request){

  const {fullname , email, password} = await request.json()

  //Validar que la password sea mayor a 6 caracteres
  try
    {
    await connect();
    if(!password || password.length < 6) return NextResponse.json({
      message: "Password must be at least 6 characters long"}, {
        status: 400,
      }
    )
    const userFound = await User.findOne({email})
  
    if (userFound) return NextResponse.json({
      message: "User already exists"}, {
        status: 400,
      }
    );
  
    const hashedPassword = await bcrypt.hash(password, 12);
  
    const user = new User({email, fullname, password: hashedPassword})
  
    const savedUser = await user.save();
  
    return NextResponse.json(savedUser);

  }
  catch (error){
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
      },{
        status: 500,
      })
      
    }
  }
}

