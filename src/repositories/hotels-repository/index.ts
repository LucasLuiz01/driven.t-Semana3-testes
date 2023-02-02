import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

async function getHotelsUser() {
    return await prisma.hotel.findMany({})
}
async function getHotelsById(hotelId:number) {
    return await prisma.hotel.findFirst({
        where:{
            id: hotelId
        }
    })
}


const hotelsRepository = {
    getHotelsUser,
    getHotelsById
  };
  
  export default hotelsRepository;
  