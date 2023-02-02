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
  }  =  await ticketRepository.findTicketByEnrollmentId(enrollmentId);
  if (!ticket) {
    throw notFoundError();
  }
  if(ticket.status === "RESERVED" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false){
    throw paymentRequired();
  }
  const hotels = await hotelsRepository.getHotelsUser();
  return hotels;
}
///////////////////////////////////////////////////////////////////
async function getHotelByHotelId(userId:number, hotelId:number){
  const enrollment: Enrollment = await enrollmentRepository.findEnrollmentByUserId(userId)
  if (!enrollment) {
    console.log("cai aquiiiiiiii")
    throw notFoundError();
  }
  const enrollmentId: number = enrollment.id
  const ticket: Ticket & {
    TicketType: TicketType;
  }=  await ticketRepository.findTicketByEnrollmentId(enrollmentId);
  if (!ticket) {
    throw notFoundError();
    console.log("cai aquiiiiiiii")
  }
  if(ticket.status === "RESERVED" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false){
    console.log("cai aquiiiiiiii")
    throw paymentRequired();
  }
  const hotel = await hotelsRepository.getHotelsById(hotelId);
  if(!hotel){
    throw notFoundError();
  }
  return hotel;
}

const hotelsService = {
    getHotelsUser,
    getHotelByHotelId
  };
  
  export default hotelsService;
  