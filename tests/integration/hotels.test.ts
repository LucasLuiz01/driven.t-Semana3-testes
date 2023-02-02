import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { User } from "@prisma/client";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  createHotels,
  createRooms,
  createTicketTypeHotel
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});
const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
 it("should respond with status 401 if no session for token", async () => {
   const userWithoutSession = await createUser();
   const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
   const response = await server.get("/payments").set("Authorization", `Bearer ${token}`);
   expect(response.status).toBe(httpStatus.UNAUTHORIZED);
 })
 it("should respond with status 404 if no enrollment for user", async () => {
  const user = await createUser();
  const token = await generateValidToken(user)
  const otherUser = await createUser();
  await createEnrollmentWithAddress(otherUser)
   const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
   expect(response.status).toBe(httpStatus.NOT_FOUND);
 })
 it("should respond with status 404 if not ticket for user", async () => {
   const user = await createUser();
   const token = await generateValidToken(user)
   await createEnrollmentWithAddress(user)
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  })
   it("should respond with status 402 if ticket is not paid by user", async () => {
    const user: User = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const enrollmentId = enrollment.id
    const ticketTypeId = ticketType.id
    const ticket = await createTicket(enrollmentId, ticketTypeId, TicketStatus.RESERVED);
     const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
     expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
   })
   it("should respond with status 402 if event is remote", async () => {
    const user: User = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isRemote = true;
    const includesHotel = false;
    const ticketType = await createTicketTypeHotel(isRemote,includesHotel);
    const enrollmentId = enrollment.id
    const ticketTypeId = ticketType.id
    const ticket = await createTicket(enrollmentId, ticketTypeId, TicketStatus.PAID);
     const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
     expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
   })
   it("should respond with status 402 if event is not include hotel", async () => {
    const user: User = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isRemote = false;
    const includesHotel = false;
    const ticketType = await createTicketTypeHotel(isRemote,includesHotel);
    const enrollmentId = enrollment.id
    const ticketTypeId = ticketType.id
    const ticket = await createTicket(enrollmentId, ticketTypeId, TicketStatus.PAID);
     const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
     expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
   })
   it("should respond with status 200", async () => {
    const user: User = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isRemote = false;
    const includesHotel = true;
    const ticketType = await createTicketTypeHotel(isRemote,includesHotel);
    const enrollmentId = enrollment.id
    const ticketTypeId = ticketType.id
    const ticket = await createTicket(enrollmentId, ticketTypeId, TicketStatus.PAID);
    const hotel = await createHotels();
    const rooms = await createRooms(hotel)
     const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
     expect(response.status).toBe(httpStatus.OK);
     expect(response.body).toEqual(
      expect.arrayContaining([{
        id: expect.any(Number),
        name: expect.any(String),
        image: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }])
     )
   })


})
