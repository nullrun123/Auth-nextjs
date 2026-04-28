import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import authConfig from "./auth.config"
import { getUserById } from "./data/user"
import { getAccountByUserId } from "./data/account"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas"
import bcrypt from "bcryptjs"


 
export const { auth, handlers:{GET,POST}, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    ...authConfig.providers.filter(
      (p) => p.id !== "credentials" // เอาแค่ Google
    ),
    Credentials({
      async authorize(credentials){
        const validateData = LoginSchema.safeParse(credentials);
        if(!validateData.success) return null;

        const { email, password } = validateData.data;

        const user = await prisma.user.findFirst({
          where: { email }
        });

        if(!user || !user.password || !user.email) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(passwordMatch) return user;

        return null;
      }
    })
  ],
  callbacks:{
    async signIn({ user,account}){
      // กรณีที่การlogin ไม่ใช่ google เพราะมาจาก google จะใให้ผ่านไปได้เลย ไม่ต้องรอ
      if(account?.provider !== 'credentials'){
        return true;
      }
    
      // ลงมาคือกรณีเป็นcredentails จะให้เช็คว่า มีการ ยืนยัน เมลยัง ถึงจะให้เข้า
      const existingUser = await getUserById(user.id ?? "");

      if(!existingUser?.emailVerified){
        return false;
      }
      return true;
    },
    async jwt({token}){
      // จะได้ข้อมูลของuser ตอนนี้มา
      // console.log('jwt',token)

      // 1. ตรวจสอบว่ามี user ID (token.sub) หรือไม่
      if(!token.sub) return token;

      // 2. ดึงข้อมูลจาก DB
      const existingUser = await getUserById(token.sub);
      if(!existingUser) return token;


      // 3. ตรวจสอบว่าเป็น oAuth หรือไม่ คือ login ด้วย Google
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOauth = !!existingAccount // แปลงเป็น boolean

      // เพิ่มข้อมูลด้วย token เวลามีอัปเดรต จะแก้ไขให้
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;
      return token
    },
    // ทำงานทุกครั้งที่ดึงข้อมูล session (เช่นเรียก useSession())
    async session({token,session}){
      // console.log("session token ",token)
      // console.log("session object ",session)



      return {
        ...session,
        user:{
          ...session.user,
          id: token.sub,           // เพิ่ม user ID
          isOauth: token.isOauth,  // เพิ่มสถานะ OAuth
          // name:token.name,

        }
      };
    }
  }
})