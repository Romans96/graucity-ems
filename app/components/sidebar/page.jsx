'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Image from "next/image";
import CloseIcon from "public/x-icon-black-2.png"

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
  const [viewChangeLog, setViewChangeLog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      let {data: {session} } = await supabase.auth.getSession();
      let { data } = await supabase.from('profili').select().eq('id', session.user.id);
      setProfile(p => p = data[0]);
      // console.log(profile, data[0])
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
    <>
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
          {features && features.listaPortiDArmi != null && <button
            title="Mostra i documenti riguardanti i Porto d'Armi"
            onClick={(e) => {
              handleVisibility("portiDArmi");
              setClicked({portoarmi: true});
            }}
            style={{
              color: cliecked.portoarmi ? 'black' : ''
            }}
            >
            Porto d&apos;Armi
          </button>}

          {features && features.listaCartelleCliniche != null && <button
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

          {features && features.listaRegistriNascite != null && <button
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

          {features && features.listaElencoDipendenti != null && <button
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

          {features && features.listaProfili != null && <button
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

        <button
          className="absolute bottom-1 right-1 text-xs text-orange-600"
          onClick={() => setViewChangeLog(true)}
        >
          Changelog  (current v1.5)
        </button>
      </section>
      
      
      {viewChangeLog &&
        <>
          <div
            className="absolute w-full h-full bg-orange-700 opacity-50 z-[10]"
          ></div>
          
          <section
              className="absolute -translate-y-1/2 -translate-x-1/2 left-1/2 top-1/2 bg-orange-600 w-3/4 h-3/4 z-[15]
              overflow-auto no-scrollbar max-h-[91%] rounded-2xl py-4 px-10 text-white
              border border-2 flex flex-col
              [&>*]:flex [&>*]:justify-center [&>*]:flex-wrap
              "
            >
            <span className="bold uppercase self-center items-center text-xl text-orange-200
            "
            >ChangeLog</span>

            <p className="w-full border border-1 m-2"></p>

            <div
              className="overflow-auto flex flex-col"
            >

              <div>
                <ul className="list-disc list-inside text-orange-200">
                  <li className="text-orange-200">v1.5 - (12/09/2023)</li>
                </ul>
                <ul>
                  <li>- Fix Pagina Porti d&apos;Armi per il ruolo infermiere</li>
                  <li>- Aggiunta Barra di Ricerca in ogni sezione</li>
                </ul>
              </div>

              <div>
                <ul className="list-disc list-inside text-orange-200">
                  <li>v1.2 - (05/09/2023)</li>
                </ul>
                <ul>- Fix Elenco Dipendenti -&#62; Solo primari e direttori possono aggiungere</ul>
              </div>

              <div>
                <ul className="list-disc list-inside text-orange-200">
                  <li>v1.1 - (04/09/2023)</li>
                </ul>
                <ul>- Fix Nomi Medici nella tabella dei Porto d&apos;armi, Cartelle cliniche e registro nascite</ul>
              </div>
              
              <div>
                <ul className="list-disc list-inside text-orange-200">
                  <li>v1.0 - (04/09/2023)</li>
                </ul>
                <ul>- Rilascio sito</ul>
              </div>
            </div>
            

            <Image src={CloseIcon}
              alt="close icon"
              className="absolute right-2 top-2 cursor-pointer h-[1.5rem] invert w-auto
                hover:blur-sm
              "
              onClick={() => {
                setViewChangeLog(false);
              }}
            />

          </section>
        </>
      }
    </>
  )
}