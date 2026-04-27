"use client"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
// import { register } from "@/actions/register";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";
import GoogleLogin  from "../google-login";
import CardWrapper from "../card-wrapper";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { register } from "@/actions/register";


function RegisterForm() {
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
 
    const form = useForm<z.infer<typeof RegisterSchema>>({
        // ทำงานตามschemaนี้
        resolver: zodResolver(RegisterSchema),
        defaultValues:{
            email:"",
            name:"",
            password:"",
            passwordConfirmation:"",
        }
    })

    const onSubmit = async(data:z.infer<typeof RegisterSchema>)=>{
        setLoading(true);
        register(data).then((res)=>{
            if(res.error){
                setError(res.error);
                setSuccess("");
                setLoading(false);
            }
            // กันerror ไม่ใช้ else (เพราะหน้านั้น มีการส่งerror หลายตน.)
            if(res.success){
                setError("");
                setSuccess(res.success);
                setLoading(false);
            }
            setLoading(false);
        })
    }
  return (
    <CardWrapper
      headerLabel="Create an account"
      title="Register"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account"
      showSocial
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="register-email"
                  placeholder="johndoe@email.com"
                  type="email"
                  disabled={loading}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="register-name"
                  placeholder="John Doe"
                  disabled={loading}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-password">Password</FieldLabel>
                <Input
                  {...field}
                  id="register-password"
                  placeholder="******"
                  type="password"
                  disabled={loading}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="passwordConfirmation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-password-conf">
                  Confirm Password
                </FieldLabel>
                <Input
                  {...field}
                  id="register-password-conf"
                  placeholder="******"
                  type="password"
                  disabled={loading}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <FormSuccess message={success} />
        <FormError message={error} />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </Button>
      </form>
    </CardWrapper>
  );
}

export default RegisterForm;
