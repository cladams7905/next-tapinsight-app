import RegisterForm from "../components/RegisterForm";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function Signup() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (!error && data?.user) {
    redirect("/dashboard/create");
  }

  return (
    <main className="bg-gradient-to-br from-primary/5 via-white to-secondary/45">
      <div className="navbar fixed lg:px-20 font-sans">
        <div className="navbar-start">
          {/* <Logo/> */}
          <div className="ml-2 font-bold">ToastJam</div>
        </div>
      </div>
      <div className="flex min-h-screen w-full flex-col items-center justify-between p-24 font-sans">
        <RegisterForm />
      </div>
    </main>
  );
}
