'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function googleAuthenticate(){
    try{
        // เรียกใช้ NextAuth เพื่อ redirect ผู้ใช้ไปหน้า Google OAuth
        await signIn('google')
    }catch(error){
        if(error instanceof AuthError){
            return 'google log in failed'  // ส่ง error กลับไปแสดงใน UI
        }
        throw error  // error อื่น ๆ โยนทิ้งไปเลย
    }
}