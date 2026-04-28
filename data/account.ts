import { prisma } from '@/lib/prisma';

export const getAccountByUserId =  async(userId:string) =>{
    try{
          // ดึงaccpunt มทมา
    const account = await prisma.account.findFirst({
        where:{
            userId:userId
        }
    })
    return account

    }catch(error){
        console.log(error)
    }
  
}