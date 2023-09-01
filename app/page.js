import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import Dashboard from './components/dashboard/page';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: {session} } = await supabase.auth.getSession();
  // console.log(session)
  if (!session) {
    return redirect('/components/login')
  }
  const { data: {user} } = await supabase.auth.getUser();
  // console.log(session.user.id)

  const features = {}
  let { data } = await supabase.from("profili").select().eq('id', session.user.id).limit(1);
  const utente = data[0];
  // console.log(session, user, utente)
  if(session && user && !utente || session && !user && !utente) {
    // return NextResponse.json({error: 'Internal server error'},{
    //   status: 500,
    //   statusText: "Errore contattare un amministratore!"
    // })
    return (
      <p className="absolute -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 text-center">
        Errore: Contatta un amministratore del sito fornendo questo codice: {session.user.id}
      </p>
    )
    // return redirect("/")
  }

  // Retries the Porti d'Armi
  if (utente.ruolo.toLowerCase() === "infermiere" ||
    utente.ruolo.toLowerCase() === "medico" ||
    utente.ruolo.toLowerCase() === "primario" ||
    utente.direttore
  ) {
    let { data } = await supabase.from("porti_darmi").select().order('created_at', {ascending: false});
    // console.log(data)
    features.listaPortiDArmi = data;
  } else {
    features.listaPortiDArmi = null;
  }

  if (utente.ruolo.toLowerCase() === "medico" ||
    utente.ruolo.toLowerCase() === "primario" ||
    utente.direttore
  ) {
    let { data } = await supabase.from("cartelle_cliniche").select().order('created_at', {ascending: false});
    features.listaCartelleCliniche = data;
  } else {
    features.listaCartelleCliniche = null;
  }

  if (utente.ruolo.toLowerCase() === "medico" ||
    utente.ruolo.toLowerCase() === "primario" ||
    utente.direttore
  ) {
    let { data } = await supabase.from("registri_nascite").select().order('created_at', {ascending: false});
    features.listaRegistriNascite = data;
  } else {
    features.listaRegistriNascite = null;
  }

  if (utente.ruolo.toLowerCase() === "primario" ||
    utente.direttore) 
  {
    let { data } = await supabase.from("elenco_dipendenti").select().order('created_at', {ascending: false});
    features.listaElencoDipendenti = data;
  } else {
    features.listaElencoDipendenti = null;
  }

  if (utente.direttore) {
    let { data } = await supabase.from("profili").select().order('created_at', {ascending: false});
    // console.log(data)
    features.listaProfili = {
      acceptableRoles: ["cliente", "infermiere", "medico", "primario"],
      acceptableSex: ["M", "F"],
      lista: data
    };
  } else {
    features.listaProfili = null
  }

  return  (
    <Dashboard session={session} features={features}  />
  )
}
