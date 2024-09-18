import { Tables } from "@/supabase/types";
import Stripe from "stripe";

/**
 * The necessary data that is collected for the embed widget's displayed events.
 */
export interface EventData {
  events: Tables<"Events">[];
  displayData: DisplayData;
}

export interface DisplayData {
  stripeData: {
    charges?: Stripe.Charge[];
    checkoutSessions?: Stripe.Checkout.Session[];
  };
}
