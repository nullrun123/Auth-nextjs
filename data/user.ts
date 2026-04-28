import { prisma } from "@/lib/prisma";

export const getUserById = async(id:string)=>{
    try{

        const user = prisma.user.findUnique({
            where:{ 
                id:id,
            }
        })
        return user;

    }catch(error){
        console.log(error);
        return null;
    }
}