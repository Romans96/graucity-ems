import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./login-client";

export const dynamic = 'force-dynamic';

export default async function LoginServer() {
  const supabase = createServerComponentClient({ cookies });
  const { data: {session} } = await supabase.auth.getSession();
  if (!session) {
    return redirect('/components/login')
  }

  <LoginClient session={session} />
}