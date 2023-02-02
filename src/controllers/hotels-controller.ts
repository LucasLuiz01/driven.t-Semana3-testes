import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import hotelsService from "@/services/hotels-service";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const payment = await hotelsService.getHotelsUser(userId);
    if (!payment) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "NotFoundError") {
      console.log("dsaodasdsadsadsa")
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "PaymentRequired") {
        return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
      }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
    try {
      const hotelId = Number(req.query.hotelId);
      const { userId } = req;
  
      if (!hotelId) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
      }
      const payment = await hotelsService.getHotelByHotelId(userId, hotelId);
  
      if (!payment) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      return res.status(httpStatus.OK).send(payment);
    } catch (error) {
      if (error.name === "UnauthorizedError") {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
      }
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }