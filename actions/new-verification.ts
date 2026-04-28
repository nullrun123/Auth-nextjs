"use server"

import { prisma } from "@/lib/prisma"
import { getUserByEmail } from "@/data/user"
import  {  getVerificationByToken } from '@/data/verification-token';


export const newVerification = async (token:string)=>{
    const existingToken = await getVerificationByToken(token);

    if(!existingToken){
        return{error:"Invalid token"}
    }

    // ถ้าเวลาปัจจุบันมากกว่า เดิมแล้ว
    const hasExired = new Date(existingToken.expires) < new Date();

    if(hasExired){
        return {error: "Token has exired"};
    }

    const existingUser = await getUserByEmail(existingToken.email);
    
    // ถ้าไม่เจแ user จาก email ของ token
    if(!existingUser){
        return { error:"User not Found"}
    }

    await prisma.user.update({
        // หา user id นั้น
        where:{
            id: existingUser.id
        },
        data:{
            // ver แล้ว เมื่อเวลานี้
            emailVerified: new Date(),
            email:existingToken.email,
        }
    })

    // delete id เก่าออก
    await prisma.verificationToken.delete({
        where:{
            id: existingToken.id
        }
    })

    return { success:"Email Verified"}
}