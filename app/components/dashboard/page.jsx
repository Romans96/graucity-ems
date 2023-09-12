'use client'
import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect, useRouter } from "next/navigation";
import { useState } from 'react';
import Sidebar from "../sidebar/page";
import PortoDArmi from "../portodarmi/page";
import CartellaClinica from "../cartellaclinica/page";
import RegistroNascita from "../registronascite/page";
import ElencoDipendenti from "../elencodipendenti/page";
import ElencoUtenti from "../elencoutenti/page";

export default function Dashboard({ session, features }) {
  const supabase = createClientComponentClient();
  // const supabase = createServerComponentClient();
  const router = useRouter();
  const [componentsVisibility, setComponentsVisibility] = useState({
    portiDArmi: false,
    cartelleCliniche: false,
    registriNascite: false,
    elencoDipendenti: false,
    elencoUtenti: false
  })
  

  const handleVisibility = async (tipo) => {
    // console.log("Test handle", tipo)
    Object.keys(componentsVisibility).forEach( v => { setComponentsVisibility({[`${v}`]: false})} )
    // console.log(componentsVisibility)
    setComponentsVisibility({
      [`${tipo}`]: true
    });
    
    /* if (!componentsVisibility[`${tipo}`]) {
      await setComponentsVisibility({
        [`${tipo}`]: true
      });
    }
    else {
      await setComponentsVisibility({
        [`${tipo}`]: false
      });
    } */
  } 

  return session ? (
    <>
      <div className="flex flex-row w-screen overflow-none bg-orange-300">
        <Sidebar handleVisibility={handleVisibility} features={features} />
        {features.listaPortiDArmi && componentsVisibility.portiDArmi && <PortoDArmi listaPortiDArmi={features.listaPortiDArmi} /> }

        {features.listaCartelleCliniche && componentsVisibility.cartelleCliniche && <CartellaClinica listaCartelleCliniche={features.listaCartelleCliniche} /> }

        {features.listaRegistriNascite && componentsVisibility.registriNascite && <RegistroNascita listaRegistriNascite={features.listaRegistriNascite} /> }

        {features.listaElencoDipendenti && componentsVisibility.elencoDipendenti && <ElencoDipendenti listaElencoDipendenti={features.listaElencoDipendenti} />}

        {features.listaProfili && componentsVisibility.elencoUtenti && <ElencoUtenti listaProfili={features.listaProfili}  /> }
      </div>
    </>
  ) : (
    redirect("/")
  );
}


