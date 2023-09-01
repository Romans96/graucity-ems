'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation";

export default function SignOutClient() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const { error } = supabase.auth.signOut();
    router.refresh();
}