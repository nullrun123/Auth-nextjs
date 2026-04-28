import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { privateRoutes } from "./routes"

const { auth } = NextAuth(authConfig)
export default auth(async (req) =>{
    // console.log("Middleware called ",req.nextUrl.pathname)
    // console.log(req.auth)

    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const url = 'http://localhost:3000';

    // เช็คว่าnextUrl ตรงกับใน privateRoutes ไหม
    const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);

    const isAuthRoute = nextUrl.pathname.includes("/auth");

    const isApiRoute = nextUrl.password.includes("/api");

    if(isApiRoute){
        return;
    }

    // ถ้ามี login กับตอนนี้เป็นหน้าที่มี path api
    if(isLoggedIn && isAuthRoute){
      // ไปdashboard ได้
      return Response.redirect(`${url}/dashboard`)
    }

    // ถ้าอยุ่หน้าauth แต่ไม่มี login
    if(isAuthRoute && !isLoggedIn){
      return;
    }
    
    // ถ้าไปหน้าที่เป็น PrivateRoute แบบ ไม่มี auth
    if(!isLoggedIn && isPrivateRoute){
      // ให้เด้งไปlogin
      return Response.redirect(`${url}/auth/login`)
    }
}) 


export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// Pattern ความหมาย/((?!.+\\.[\\w]+$|_next).*)จับทุก path ยกเว้น ไฟล์ที่มีนามสกุล (เช่น .png, .css) 
// และ path ของ _next (static files)
// /จับ root path/(api|trpc)(.*)
// จับทุก path ที่ขึ้นต้นด้วย /api/... หรือ /trpc/...