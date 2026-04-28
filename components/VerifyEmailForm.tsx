"use client"
 
import { useSearchParams } from "next/navigation";
import CardWrapper from "./card-wrapper";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { useEffect, useState , useCallback } from "react";
import { newVerification } from "@/actions/new-verification";

function VerifyEmailForm() {
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);

    const searchParams = useSearchParams();
    // เอาparams ที่เป็นของ token (token=...)
    const token = searchParams.get("token");

    // useCallback — ป้องกันรันซ้ำ
    const onSubmit = useCallback(()=>{
      if(success || error){  // ✅ ถ้ามีผลแล้ว ไม่ทำซ้ำ
        return;
      }

      if(!token){
        setError("No token provided")
        return
      }

      newVerification(token).then((data)=>{
        if(data.success){
          setSuccess(data.success);
        }
        if(data.error){
          setError(data.error)
        }
      }).catch((error)=>{
        console.log(error);
        setError("An unexpected error occurred")
      })

    },[token,success,error])
    useEffect(()=>{
      onSubmit(); // ✅ พอหน้าโหลด → verify ทันที ไม่ต้องกดปุ่ม
    },[])


  return (
    <CardWrapper
      headerLabel="Confirming your email address"
      title="Confirming now..."
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <p>Loading</p>}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  )
}

export default VerifyEmailForm


