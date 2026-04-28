import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = "http://localhost:3000"


export const sendVerificationEmail = async(email:string,token:string)=>{
    const confirmationLink = `${domain}/verify-email?token=${token}`

    const { data ,error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to:email,
        subject:"Verify your email",
        html:`<p>Click <a href='${confirmationLink}'>here</a> to verify your email.</p>`
    })
    
    // console.log("Resend data:", data)
    // console.log("Resend error:", error)
    
    if (error) {
      return Response.json({ error }, { status: 500 });
    }
    return data
}