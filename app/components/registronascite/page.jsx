"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationAlert from "../notification-alert/page";

import Image from "next/image";
import searchIcon from 'public/search-icon.png';
import XIcon2 from "public/x-icon-black-2.png";

export default function RegistroNascita({ listaRegistriNascite }) {
  const supabase = createClientComponentClient();
  const [direttore, setDirettore] = useState(false);
  const [nomeDottore, setNomeDottore] = useState("");
  const [showInsertForm, setShowInsertForm] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const initialForm = {
    nome: "",
    cognome: "",
    data_nascita: "",
    sesso: "",
  };
  const [insertForm, setInsertForm] = useState(initialForm);
  const [ingrandisci, setIngrandisci] = useState({...initialForm, show: false, url: ""});
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      var {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      var { data } = await supabase
        .from("profili")
        .select()
        .eq("id", user.id)
        .limit(1);
      setNomeDottore(data[0].nome);
      setDirettore(data[0].direttore);
    }
    fetchData();
  }, []);

  async function newRegistroNascita(e) {
    e.preventDefault();
    fetch("/api/new-registronascita", {
      method: "post",
      body: JSON.stringify(insertForm),
      headers: {
        type: "Application/json",
      },
    })
      .then((res) => {
        setShowInsertForm(false);
        setInsertForm(initialForm);
        // console.log("res", res.statusText);
        setNotification({ show: true, message: res.statusText });
        setTimeout(() => {
          setNotification({ show: false, message: "" });
        }, 8000);
        router.refresh();
      })
      .catch((err) => {
        console.log("catching: ", err);
      });
  }

  function eliminaNascita(id, table) {
    fetch("/api/delete-query", {
      method: 'post',
      body: JSON.stringify({
        id: id,
        table: table
      }),
      headers: {
        type: "Application/json",
      },
    }).then((res) => {
      setNotification({ show: true, message: res.statusText });
      setTimeout(() => {
        setNotification({ show: false, message: "" });
      }, 8000);
      router.refresh();
    })
  }

  const [searchedList, setSearchedList] = useState(listaRegistriNascite);
  const [searchString, setSearchString] = useState("");
  useEffect(() => {
    setSearchedList(listaRegistriNascite);
  }, [listaRegistriNascite])
  // console.log(listaRegistriNascite, searchedList)
  function searchFunction(event) {
    // const searchString = event.target.value.toLowerCase();
    setSearchString(event.target.value.toLowerCase());
    const regex = new RegExp(`${searchString}`,'g')
    // console.log(searchString, regex)
    let newLista = listaRegistriNascite.filter((item) => 
      item.nome.toLowerCase().match(regex) ||
      item.cognome.toLowerCase().match(regex) ||
      item.sesso.toLowerCase().match(regex) ||
      item.profili.nome.toLowerCase().match(regex)
    );
    // console.log(newLista);
    setSearchedList(newLista);
  }

  return (
    <div className="mx-auto mt-5 overflow-none">
      <div className="flex flex-row w-full justify-between mb-2"> 
        <img 
          src="/+-icon-black.png"
          title="Aggiungi un nuovo documento"
          className="w-10 saturate-100 opacity-100 hover:invert cursor-pointer"
          onClick={() => {
            setShowInsertForm(true);
          }}
        />
        <div className="flex flex-row h-10">
          <Image
            src={searchIcon}
            alt="Ricerca documento"
            title="Digita qui a destra per effettuare la ricerca"
            className="absolute my-auto -ml-4
              h-10 w-auto bg-orange-300 rounded-full px-1 py-1
            "

          />
          <input 
            id="inputSearch"
            className="text-black w-72 pl-7 pr-8 outline-none rounded-lg
              placeholder:text-xs placeholder:whitespace-pre-line placeholder:-translate-y-2 placeholder:opacity-60"
            type="text"
            onChange={searchFunction}
            placeholder="Cerca un documento per Nome, Cognome, Sesso o Nome del Dottore"
          />

          {/* {document.getElementById("inputSearch")?.value != "" */} 
          {searchString != "" && 
            <div className="flex flex-row justify-end">
              <Image
                src={XIcon2}
                alt="Elimina ricerca"
                title="Resetta ricerca"
                className="absolute my-auto
                  h-10 w-auto rounded-full px-1 py-2
                "
                onClick={() => { 
                  document.getElementById("inputSearch").value = "";
                  setSearchString("");
                  setSearchedList(listaRegistriNascite)
                }}
              />
            </div>
          }
        </div>
      </div>



      <div className="h-[88vh] w-[70vw]">
        <div className="flex flex-row h-16 items-center
            [&>*]:text-center [&>*]:w-[100%] [&>*]:h-[100%]
            [&>*]:text-base [&>*]:my-auto [&>*]:flex [&>*]:items-center [&>*]:justify-center [&>*]:whitespace-pre-wrap
            [&>*]:border-b-2 [&>*]:border-orange-100

            [&>*]:text-lg [&>*]:text-orange-900 [&>*]:font-bold [&>*]:break-words [&>*]:whitespace-break-spaces
          ">
          <span className="border-r-2">Nome</span>
          <span className="border-r-2">Cognome</span>
          <span className="border-r-2">Data di Nascita</span>
          <span className="border-r-2">Data rilascio</span>
          <span className="border-r-2">Sesso</span>
          <span>Nome dottore</span>
          <span></span>
          {direttore && <span></span>}
        </div>

        <div className="overflow-auto no-scrollbar max-h-[91%]">
          {listaRegistriNascite && searchedList?.map((item) => {
            let data_nascita = new Date(item.data_nascita);
            data_nascita = data_nascita.getDate()+"/"+(data_nascita.getMonth()+1)+"/"+data_nascita.getFullYear();
            let data_rilascio = new Date(item.created_at);
            data_rilascio = data_rilascio.getDate()+"/"+(data_rilascio.getMonth()+1)+"/"+data_rilascio.getFullYear()+" - "+data_rilascio.getHours()+":"+data_rilascio.getMinutes();
            // console.log(item.created_at, data_rilascio)
            return (
              <div key={item.id} className="flex flex-row items-center justify-around [&>*]:w-[100%] [&>*]:text-center
                flex flex-row h-16 items-center text-black
                [&>*]:text-center [&>*]:w-[100%] [&>*]:h-[100%]
                [&>*]:text-base [&>*]:my-auto [&>*]:flex [&>*]:items-center [&>*]:justify-center [&>*]:whitespace-pre-wrap
                [&>*]:border-b-2 [&>*]:border-orange-100
              ">
                <span className="border-r-2">{item.nome}</span>
                <span className="border-r-2">{item.cognome}</span>
                <span className="border-r-2">
                  {data_nascita}
                </span>
                <span className="border-r-2">
                  {data_rilascio}
                </span>
                <span className="border-r-2">{item.sesso.toUpperCase()}</span>
                <span>{item.profili.nome}</span>
                <span>
                  <img 
                    src="/fullscreen-icon.png"
                    title="Dettagli documento"
                    className="cursor-pointer object-contain h-1/2 hover:h-4/5 saturate-100"
                    onClick={() => {
                      if (!ingrandisci.show) {
                        setIngrandisci(ing => {
                          const newIng = {...ing};
                          
                          newIng.nome = item.nome;
                          newIng.cognome = item.cognome;
                          newIng.sesso = item.sesso;
                          newIng.data_nascita = data_nascita;
                          newIng.data_rilascio = data_rilascio;
                          newIng.show = true;

                          // console.log(newIng, ingrandisci.screen)
                          return newIng;
                        })
                      } else {
                        setIngrandisci({...initialForm, show: false})
                      }
                    }} 
                  />
                </span>
                {direttore && <span>
                  <img 
                    src="/delete-icon-table.png"
                    title="Elimina documento"
                    className="cursor-pointer object-contain h-1/3 hover:h-3/5 saturate-100"
                    onClick={() => {
                      eliminaNascita(item.id, "registri_nascite")
                    }} 
                  />
                </span>}
                
              </div>
            );
          })}
        </div>
      </div>

      {showInsertForm && (
        <div
          id="insertForm"
          className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-[100] 
            flex flex-col bg-orange-700 rounded-lg py-5 px-5 gap-3 text-base
            justify-center items-center
            [&>div>*]:placeholder:text-xs [&>div>*]:placeholder:text-orange-700
          ">
          <div
            className="flex flex-row justify-evenly w-full
              [&>label]:text-orange-200
              [&>input]:rounded-md [&>input]:px-1 [&>input]:w-3/5
            ">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              name="nome"
              placeholder="Inserisci il nome del paziente"
              value={insertForm.nome}
              onChange={(e) => {
                setInsertForm({ ...insertForm, nome: e.target.value });
              }}
              className="bg-black text-white"
            />
          </div>
          <div
            className="flex flex-row justify-evenly w-full
              [&>label]:text-orange-200
              [&>input]:rounded-md [&>input]:px-1 [&>input]:w-3/5
            ">
            <label htmlFor="cognome">Cognome</label>
            <input
              type="text"
              name="cognome"
              placeholder="Inserisci il cognome del paziente"
              value={insertForm.cognome}
              onChange={(e) => {
                setInsertForm({ ...insertForm, cognome: e.target.value });
              }}
              className="bg-black text-white"
            />
          </div>
          <div
            className="flex flex-row justify-evenly w-full
              [&>label]:text-orange-200
              [&>input]:rounded-md [&>input]:px-1 [&>input]:w-3/5
            ">
            <label htmlFor="data_nascita">Data di Nascita</label>
            <input
              type="date"
              name="data_nascita"
              value={insertForm.data_nascita}
              onChange={(e) => {
                setInsertForm({ ...insertForm, data_nascita: e.target.value });
              }}
              className="bg-black text-white"
            />
          </div>

          <div
            className="flex flex-row justify-evenly w-full
              [&>label]:text-orange-200
              [&>input]:rounded-md [&>input]:px-1 [&>input]:w-3/5
            ">
            <label htmlFor="sesso">Sesso</label>
            <select
              name="sesso"
              value={insertForm.sesso}
              onChange={(e) => {
                setInsertForm({ ...insertForm, sesso: e.target.value });
              }}
              className="bg-black text-white"
            >
              <option defaultValue>Seleziona un&apos;opzione...</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </div>

          <button
            onClick={newRegistroNascita}
            className="max-w-fit mx-auto rounded-lg bg-gray-500 px-4 hover:bg-gray-800"
          >
            Inserisci modulo
          </button>

          <img src="/x-icon-black-2.png"
            onClick={() => {
              setShowInsertForm(false);
              setInsertForm(initialForm);
            }}
            className="absolute right-2 top-2 cursor-pointer h-[1.5rem] invert
            hover:blur-sm"
          />
        </div>
      )}

      {notification.show && <NotificationAlert notification={notification} />}
    
      {ingrandisci.show && (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-1/2 h-fit bg-orange-700 p-4 rounded-lg
          flex flex-col items-center justify-center
        ">
          <span className="mx-auto underline">Dettagli Registro Nascita</span>
          <span>Nome: {ingrandisci.nome}</span>
          <span>Cognome: {ingrandisci.cognome}</span>
          <span>Sesso: {ingrandisci.sesso}</span>
          <span>Data di Nascita: {ingrandisci.data_nascita}</span>
          <span>Data di Rilascio: {ingrandisci.data_rilascio}</span>

          <img src="/x-icon-black-2.png"
            className="absolute right-2 top-2 cursor-pointer h-[1.5rem] invert
              hover:blur-sm
            "
            onClick={() => {
              setIngrandisci({...initialForm, show: false})
            }}
          />
        </div>
      )}
    </div>
  );
}
