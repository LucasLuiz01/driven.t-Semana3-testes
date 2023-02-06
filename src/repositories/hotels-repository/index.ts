import { prisma } from "@/config";

async function getHotelsUser() {
    return await prisma.hotel.findMany({})
}
async function getHotelsById(hotelId:number) {
    return await prisma.hotel.findFirst({
        where:{
            id: hotelId
        },
        include: {
            Rooms: true
        }
    })
}


const hotelsRepository = {
    getHotelsUser,
    getHotelsById
  };
  
  export default hotelsRepository;
  