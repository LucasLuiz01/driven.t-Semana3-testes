import { ApplicationError } from "@/protocols";

export function paymentRequired(): ApplicationError {
  return {
    name: "PaymentRequired",
    message: "payment required that can be used in the future to indicate a nonstandard response.",
  };
}