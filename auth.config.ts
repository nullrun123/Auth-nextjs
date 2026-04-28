// ผู้ใช้กด Login
//       ↓
// มี 2 ทาง: Google OAuth  หรือ  Email+Password
//       ↓
// ถ้าผ่านทั้งคู่ → return user → NextAuth สร้าง session
// ถ้าไม่ผ่าน → return null → login ไม่ได้

import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
    providers:[
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Credentials({
            async authorize() {
                return null; // Logic จริงอยู่ใน auth.ts
            }
        })
    ]
} satisfies NextAuthConfig