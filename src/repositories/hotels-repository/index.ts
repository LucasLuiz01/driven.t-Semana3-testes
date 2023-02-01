import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

async function getHotelsUser() {
    return await prisma.hotel.findMany({})
}


const hotelsRepository = {
    getHotelsUser
  };
  
  export default hotelsRepository;
  