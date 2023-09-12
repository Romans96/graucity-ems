import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Dashboard from './components/dashboard/page';

// export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: {session} } = await supabase.auth.getSession();
  // console.log(session)
  if (!session) {
    return redirect('/components/login')
  }
  const { data: {user} } = await supabase.auth.getUser();
  // console.log(session.user.id)

  var features = {}
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

  // console.log(utente.ruolo.toLowerCase() === "infermiere")
  // Retries the Porti d'Armi

  if (utente.ruolo.toLowerCase() === "infermiere" ||
    utente.ruolo.toLowerCase() === "medico" ||
    utente.ruolo.toLowerCase() === "primario" ||
    utente.direttore
  ) {
    let { data } = await supabase.from("porti_darmi").select(`
      id,
      nome,
      cognome,
      screen,
      created_at,
      profili (nome, ruolo, discord_id)
    `).order('created_at', {ascending: false});
    // console.log(data);

    features.listaPortiDArmi = data;


    // let updatedData = [];
    // new Promise((resolve, reject) => {
    //   data.forEach( async (userData, index) => {
    //     updatedData[index] = data[index];

    //     supabase
    //       .from("profili")
    //       .select()
    //       .eq("id", userData.profilo_id)
    //       .limit(1).then((val) => {
    //         // console.log(val.data[0].nome)
    //         updatedData[index]["nomeDottore"] = val.data[0].nome
    //         updatedData[index]["dottoreDiscord"] = val.data[0].discord_id
    //         // console.log(index, data.length)
    //         // console.log(data);
    //         if (index === data.length-1) {
    //           console.log("Fine for each")
    //           resolve();
    //         }
    //       })
    //   })
      
    // }).then((res) => {
    //   // console.log(data);
    //     // console.log(data[2])
    //   features.listaPortiDArmi = updatedData;
    //   // console.log(features.listaPortiDArmi);
    // })
  } else {
    features.listaPortiDArmi = null;
  }
  // console.log(features.listaPortiDArmi);

  if (utente.ruolo.toLowerCase() === "medico" ||
    utente.ruolo.toLowerCase() === "primario" ||
    utente.direttore
  ) {
    
    let { data } = await supabase.from("cartelle_cliniche").select(`
      id,
      nome,
      cognome,
      screen,
      created_at,
      profili (nome, ruolo, discord_id)
    `).order('created_at', {ascending: false});
    features.listaCartelleCliniche = data;

    // features.listaCartelleCliniche = data;
    // new Promise((resolve, reject) => {
    //   data.forEach( async (userData, index) => {
    //     supabase
    //       .from("profili")
    //       .select()
    //       .eq("id", userData.profilo_id)
    //       .limit(1).then((val) => {
    //         // console.log(val)
    //         data[index].nomeDottore = val.data[0].nome
    //         data[index].dottoreDiscord = val.data[0].discord_id
    //         // console.log(index, data.length)
    //         if (index === data.length-1) {
    //           resolve();
    //         }
    //       })
    //   })
      
    // }).then((res) => {
    //   // console.log(data);
    //     // console.log(data[2])
    //   features.listaCartelleCliniche = data;
    // })
  } else {
    features.listaCartelleCliniche = null;
  }

  if (utente.ruolo.toLowerCase() === "medico" ||
    utente.ruolo.toLowerCase() === "primario" ||
    utente.direttore
  ) {
    let { data } = await supabase.from("registri_nascite").select(`
      id,
      nome,
      cognome,
      sesso,
      data_nascita,
      created_at,
      profili (nome, ruolo, discord_id)
    `).order('created_at', {ascending: false});
    features.listaRegistriNascite = data;

    // features.listaRegistriNascite = data;
    // new Promise((resolve, reject) => {
    //   data.forEach( async (userData, index) => {
    //     supabase
    //       .from("profili")
    //       .select()
    //       .eq("id", userData.profilo_id)
    //       .limit(1).then((val) => {
    //         // console.log(val)
    //         data[index].nomeDottore = val.data[0].nome
    //         data[index].dottoreDiscord = val.data[0].discord_id
    //         // console.log(index, data.length)
    //         if (index === data.length-1) {
    //           resolve();
    //         }
    //       })
    //   })
      
    // }).then((res) => {
    //   // console.log(data);
    //     // console.log(data[2])
    //   features.listaRegistriNascite = data;
    // })
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

  return (
    <Dashboard session={session} features={features}  />
  )
}
