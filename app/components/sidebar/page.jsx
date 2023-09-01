'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Clicker_Script } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar({ handleVisibility, features }) {
  // console.log(handleVisibility)
  // console.log(features.listaPortiDArmi.length != 0)
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState({});
  const [title, setTitle] = useState("cliente");
  const [cliecked, setClicked] = useState({
    portoarmi: false,
    cartellaclinica: false,
    registronascite: false,
    elencodipendenti: false,
    elencoutenti: false
  })
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      let {data: {session} } = await supabase.auth.getSession();
      let { data } = await supabase.from('profili').select().eq('id', session.user.id);
      setProfile(p => p = data[0]);
      console.log(profile, data[0])
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (profile.ruolo !== undefined) {
      const ruoloBase = profile.ruolo;
      // console.log(profile, ruoloBase)
      setTitle(t => t = ruoloBase.charAt(0).toUpperCase() + ruoloBase.slice(1))
    }
  
  }, [profile])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    router.refresh();
  };

  const enableAllBtns = () => {
    const btns = document.querySelectorAll('button');
    btns.forEach(btn => {
      btn.style.disabled = false;
    })
  }

  return (
    <section className="flex flex-col gap-10 left-0 top-0 w-3/12 h-full
      justify-between bg-orange-900 [&>*>*]:tracking-wider
    ">
      <span className="mx-auto text-white text-3xl [&>*]:font-lobster
        flex flex-col justify-center items-center text-center">
        <span className="font-lobster">EMS Grau City</span>
        <span className="text-xl text-orange-400">
          Benvenut{profile.sesso === 'M' ? 'o': 'a'} <u><b title={`Ruolo: ${title}\nNome: ${profile.nome}`}>{profile.discord_full_name}</b></u> <br/>
          seleziona una delle opzioni sottostanti
        </span>
      </span>

      <div className="flex flex-col gap-16 font-lobster text-orange-200
      [&>*]:relative [&>*]:h-fit [&>*]:w-fit [&>*]:mx-auto [&>*]:text-lg [&>*]:px-1
      [&>*:hover]:drop-shadow-xl [&>*:hover]:text-orange-600 [&>*:hover]:shadow-xl [&>*:hover]:italic  
      ">
        {features.listaPortiDArmi != null && <button
          title="Mostra i documenti riguardanti i Porto d'Armi"
          onClick={(e) => {
            handleVisibility("portiDArmi");
            setClicked({portoarmi: true});
          }}
          style={{
            color: cliecked.portoarmi ? 'black' : ''
          }}
          >
          Porto d'Armi
        </button>}

        {features.listaCartelleCliniche != null && <button
          title="Mostra i documenti riguardanti le Cartelle Cliniche"
          onClick={() => {
            handleVisibility("cartelleCliniche");
            setClicked({cartellaclinica: true});
          }}
          style={{
            color: cliecked.cartellaclinica ? 'black' : ''
          }}
          >
          Cartella Clinica
        </button>}

        {features.listaRegistriNascite != null && <button
          title="Mostra i documenti riguardanti i Registri delle Nascite"
          onClick={() => {
            handleVisibility("registriNascite");
            setClicked({registronascite: true});
          }}
          style={{
            color: cliecked.registronascite ? 'black' : ''
          }}
          >
          Registro Nascite
        </button>}

        {features.listaElencoDipendenti != null && <button
          title="Mostra la lista dei dipendenti assunti"
          onClick={() => {
            handleVisibility("elencoDipendenti")
            setClicked({elencodipendenti: true});
          }}
          style={{
            color: cliecked.elencodipendenti ? 'black' : ''
          }}
          >
          Elenco Dipendenti
        </button>}

        {features.listaProfili != null && <button
          title="Mostra ai direttori e agli amministratori tutti gli utenti registrati sul sito"
          onClick={() => {
            handleVisibility("elencoUtenti")
            setClicked({elencoutenti: true});
          }}
          style={{
            color: cliecked.elencoutenti ? 'black' : ''
          }}
          >
          Elenco Utenti
        </button>}
      </div>


      <button
        className="text-sm text-orange-100 bg-orange-600 rounded-lg px-4 py-2 w-fit mx-auto
          mb-5 tracking-widest uppercase font-lobster
          hover:text-black hover:bg-orange-200"
        onClick={handleSignOut}
      >
        Logout
      </button>
    </section>
  )
}