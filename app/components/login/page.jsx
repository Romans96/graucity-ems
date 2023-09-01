import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginServer from "./login-server";
import LoginClient from "./login-client";
import Image from "next/image";
import Logoospedale from "../../../public/Logo_Ospedale.png";

export const dynamic = 'force-dynamic';

export default async function Login() {
  const supabase = createServerComponentClient({ cookies });
  const { data: {session} } = await supabase.auth.getSession();
  // console.log(session);
  if (session) {
    redirect("/");
  }

  return (
    <>
      <a
        className="absolute text-xs text-white rounded-md bg-gray-800 px-2 py-1 ml-2 mt-2 hover:text-base"
        target="_blank"
        href="https://discord.gg/g-life"
      >
        Grau City Life Discord Server
      </a>
      <a
        className="absolute text-xs text-white rounded-md bg-gray-800 px-2 py-1 mr-2 mt-2 hover:text-base right-0"
        target="_blank"
        href="https://discord.gg/3zWze9qj2R"
      >
        Grau Hospital Discord Server
      </a>


      <div className="w-screen h-screen flex flex-col items-center justify-center my-100 gap-y-8">
        <p className="text-7xl tracking-wide font-bold font-lobster text-orange-800">
          EMS Grau City
        </p>
        <Image
          id="logoImage"
          src={Logoospedale}
          alt="Logo Ospedale"
          className="h-3/5 max-w-sm w-auto animate-spin-logo"
        />
        <LoginClient session={session} />
      </div>
    </>
  );
}
