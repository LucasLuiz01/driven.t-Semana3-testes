import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

export async function createHotels() {
    return await prisma.hotel.create({
        data: {
            image: "https://images3.motor-reserva.com.br/cdn-cgi/image/fit=scale-down,format=webp,width=1920,quality=90/curl/motor_reserva/images/configuracao_estabelecimento/cliente_487/2022012716433125363.jpg",
            name: "Victoria Hotel",
        }
    })
}

export async function createRooms(hotel: Hotel) {
    return await prisma.room.createMany({
 data: [{ capacity: 20, hotelId: hotel.id,name:  "Suíte 1"},
        { capacity: 4,  hotelId: hotel.id,name:  "Suíte 2"},
        { capacity: 4,  hotelId: hotel.id,name:  "Suíte 3"},
        { capacity: 6,  hotelId: hotel.id,name:  "Suíte 4"},
        { capacity: 2,  hotelId: hotel.id,name:  "Suíte 5"},
        { capacity: 2,  hotelId: hotel.id,name:  "Suíte 6"}
    ]
    })
}
