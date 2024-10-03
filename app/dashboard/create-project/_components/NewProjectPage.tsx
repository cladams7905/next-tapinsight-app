"use client";

import React, { useState } from "react";
import PaymentModal from "../../_components/PaymentModal";
import { PaymentPlans } from "@/lib/enums";
import Stripe from "stripe";
import { Tables } from "@/stripe/types";
import { User } from "@supabase/supabase-js";
import NewProjectForm from "./NewProjectForm";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export default function NewProjectPage({
  stripeUser,
  user,
  products,
  numProjects,
  paymentPlan,
}: {
  stripeUser: Tables<"users"> | null;
  user: User;
  products: {
    id: string;
    payment_plan: PaymentPlans;
    name: string;
    price: Stripe.Price;
  }[];
  numProjects: number | null | undefined;
  paymentPlan: string | null | undefined;
}) {
  /**
   * The date when the free trial should begin
   * If null, then payment modal opens and create project button is disabled.
   */
  const [freeTrialDate, setFreeTrialDate] = useState<string | null>(
    stripeUser?.free_trial_start_date ?? null
  );
  return (
    <>
      {!freeTrialDate && (
        <PaymentModal
          stripeUser={stripeUser}
          products={products}
          user={user}
          freeTrialDate={freeTrialDate}
          setFreeTrialDate={setFreeTrialDate}
        />
      )}
      <div className="flex items-start justify-center w-full h-screen-minus-navbar bg-gradient-to-tr from-primary/50 to-violet-100 font-sans">
        <div className="border mt-36 border-gray-300 z-[1] p-2 shadow-lg bg-base-100 rounded-md w-full max-w-lg">
          <div className="flex flex-col items-center justify-center w-full pt-6">
            <p className="font-logo text-2xl mb-4">Create New Project</p>
            {numProjects &&
            paymentPlan?.includes("Starter") &&
            numProjects >= 1 ? (
              <div className="bg-primary/10 p-2 mt-2 rounded-lg text-xs flex items-center gap-2">
                <InfoCircledIcon width={18} height={18} />
                <p>You are only allowed one project on the Starter plan.</p>
              </div>
            ) : (
              ""
            )}
            <NewProjectForm
              stripeUser={stripeUser}
              freeTrialDate={freeTrialDate}
              paymentPlan={paymentPlan}
              numProjects={numProjects}
            />
          </div>
        </div>
      </div>
    </>
  );
}
