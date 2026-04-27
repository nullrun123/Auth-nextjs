'use server'

import * as z from 'zod';
import { prisma } from '@/lib/prisma';
import { LoginSchema } from '@/schemas';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export const login = async(data:z.infer<typeof LoginSchema>)=>{
    // ตรวจ
    const validateData = LoginSchema.parse(data);

    if(!validateData){
        return { error:"Invalid input data"}
    }

    const { email,password } = validateData;

    const userExists = await prisma.user.findFirst({
        // หาemail นี้
        where:{
            email:email,
        }
    })

    
    // กรณี ชื่อ หาไม่เจอ จาก false-> true 
    if(!userExists || !userExists.password || !userExists.email){
        return{ error:"User not found"}
    }

    // case !userExists.password 
    // หา user เจอ แต่ไม่มี password
    // เกิดขึ้นเมื่อ user สมัครผ่าน OAuth (Google, GitHub)
    // เพราะ OAuth user ไม่มี password ในฐานข้อมูล

    // !userExists.email
    // หา user เจอ แต่ไม่มี email (edge case)
    // ป้องกัน data ที่ไม่สมบูรณ์ในฐานข้อมูล

    try{
        // ให้ล้อคอินเข้า โดยส่งพวกนนี้ไป
        await signIn('credentials',{
            email:userExists.email,
            password: password,
            // login ส่งไปหน้าส
            redirectTo:'/dashboard'
        })
    }catch(error){
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin":
                return { error :"Invalid credentials"}
                default:
                    return { error: "Please confirm your email address"}
            }
        }
        throw error;
    }   
    return { success: "User logged in successfully"}
}