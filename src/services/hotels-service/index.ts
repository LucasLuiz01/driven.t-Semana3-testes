import { notFoundError, paymentRequired } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { Enrollment, Ticket, TicketType } from "@prisma/client";
import ticketRepository from "@/repositories/ticket-repository";



async function getHotelsUser(userId: number) {
  const enrollment: Enrollment = await enrollmentRepository.findEnrollmentByUserId(userId)
  if (!enrollment) {
    throw notFoundError();
  }
  const enrollmentId: number = enrollment.id
  const ticket: Ticket & {
    TicketType: TicketType;
} =  await ticketRepository.findTickeWithTypeById(enrollmentId);
  if (!ticket) {
    throw notFoundError();
  }
  if(ticket.status === "RESERVED" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false){
    throw paymentRequired();
  }
  const hotels = await hotelsRepository.getHotelsUser();
  return hotels;
}


const hotelsService = {
    getHotelsUser,
  };
  
  export default hotelsService;
  