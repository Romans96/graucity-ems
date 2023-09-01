"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import discordlogo from "../../../public/DiscordLogo1.png";

export default function LoginClient({ session }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <button
      className="text-lg text-orange-100 
        flex flex-row items-center justify-center gap-2 rounded-md bg-orange-800 px-5 py-2
        hover:text-orange-950 hover:bg-orange-200 
        [&>*:nth-child(2)]:hover:invert"
      onClick={handleSignIn}
    >
      <p>Entra con Discord</p>
      <Image src={discordlogo} alt="Discord Logo" className="w-10" />
    </button>
  );
}
