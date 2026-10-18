import Razorpay from "razorpay";
import { env } from "../config/env.js";

let instance: Razorpay | undefined;

// Created on first use: the SDK throws without keys, and the rest of the API should still run.
export function getRazorpay(): Razorpay {
  instance ??= new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret,
  });
  return instance;
}
