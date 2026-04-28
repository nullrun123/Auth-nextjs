"use server"

import * as z from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypy  from 'bcryptjs';
import { RegisterSchema } from '@/schemas';
import { error } from 'console';

export const register =async(data:z.infer<typeof RegisterSchema>)=>{
    try{
        const validateData = RegisterSchema.parse(data);

        if(!validateData){
            return { error: "Invalid input data"}
        }

        const { email,name,password,passwordConfirmation} = validateData;

        if(password !== passwordConfirmation){
            return { error:"Password do not match"}
        }

        // เข้ารหัส hashed 
        const hashedPassword = await bcrypy.hash(password,10);

        // หาชื่อใน prisma ว่ามีไหม
        const userExists = await prisma.user.findFirst({
            // ที่ email นั้น
            where:{
                email
            }
        })

        // ถ้ามีซํ้า
        if(userExists){
            return { error:'User already exists'}
        }

        // ปรับ email เป็นตัวเล้ก
        const lowerCaseEmail = email.toLowerCase();

        // สร้าง prisma user และส่งไปเก็บลงDB
        const user = await prisma.user.create({
            data:{
                email:lowerCaseEmail,
                password:hashedPassword,
                name,
            }
        })

        return { success: "user created successfully"}
        
    }catch(error){
        console.log(error);
        return {error:"An error occured"}
    }
}