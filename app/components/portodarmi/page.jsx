"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { v4 as uuidv4 } from "uuid";
import NotificationAlert from "../notification-alert/page";

export default function PortoDArmi({ listaPortiDArmi }) {
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
    screen: ""
  };
  const [insertForm, setInsertForm] = useState(initialForm);
  const [file, setFile] = useState(null)
  const [ingrandisci, setIngrandisci] = useState({...initialForm, show: false, url: ""});
  const [profile, setProfile] = useState({});
  const [myUser, setMyUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      var {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      setMyUser(data);
      var { data } = await supabase
        .from("profili")
        .select()
        .eq("id", user.id)
        .limit(1);
      setProfile(user);
      setNomeDottore(data[0].nome);
      setDirettore(data[0].direttore);
    }
    fetchUser();
  }, []);

  async function newPortoDarma(e) {
    e.preventDefault();
    // Image storage
    const fileName = `${uuidv4()}_${insertForm.nome}-${insertForm.cognome}`;
    const { data, error } = await supabase.storage
      .from("screen_portidarmi")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });
    // console.log(data, error)
    
    // console.log(insertForm)
    console.log(fileName)
    // setInsertForm(form => {return {...form, screen: fileName}});
    setInsertForm(form => {
      const newForm = {...form};
      newForm.screen = fileName;
      console.log(newForm)
      fetch("/api/new-portodarma", {
        method: "post",
        body: JSON.stringify(newForm),
        headers: {
          type: "Application/json",
        },
      })
        .then((res) => {
          setShowInsertForm(false);
          setInsertForm(initialForm);
          console.log("res", res.statusText);
          setNotification({ show: true, message: res.statusText });
          setTimeout(() => {
            setNotification({ show: false, message: "" });
          }, 8000);
          router.refresh();
        })
        .catch((err) => {
          console.log("catching: ", err);
        });
      return newForm;
    });
  }

  function eliminaPortoDarmi(id, table, storage, screen) {
    fetch("/api/delete-query", {
      method: 'post',
      body: JSON.stringify({
        id: id,
        table: table,
        storage: storage,
        screen: screen
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

  return (
    <div className="mx-auto mt-5 overflow-none">
      <img 
        src="/+-icon-black.png"
        title="Aggiungi un nuovo documento"
        className="w-10 saturate-100 opacity-100 hover:invert cursor-pointer"
        onClick={() => {
          setShowInsertForm(true);
        }}
      />
      <div className="h-[88vh] w-[70vw]">
        <div className="flex flex-row h-16 items-center
            [&>*]:text-center [&>*]:w-[100%] [&>*]:h-[100%]
            [&>*]:text-base [&>*]:my-auto [&>*]:flex [&>*]:items-center [&>*]:justify-center [&>*]:whitespace-pre-wrap
            [&>*]:border-b-2 [&>*]:border-orange-100

            [&>*]:text-lg [&>*]:text-orange-900 [&>*]:font-bold [&>*]:break-words [&>*]:whitespace-break-spaces
          ">
          <span className="border-r-2">Nome</span>
          <span className="border-r-2">Cognome</span>
          <span>Nome dottore</span>
          <span></span>
          {direttore && <span></span>}
        </div>

        <div className="overflow-auto no-scrollbar max-h-[91%]">
          {listaPortiDArmi && listaPortiDArmi.map((item) => {
            return (
              <div key={item.id} className="flex flex-row items-center justify-around [&>*]:w-[100%] [&>*]:text-center
                flex flex-row h-16 items-center text-black
                [&>*]:text-center [&>*]:w-[100%] [&>*]:h-[100%]
                [&>*]:text-base [&>*]:my-auto [&>*]:flex [&>*]:items-center [&>*]:justify-center [&>*]:whitespace-pre-wrap
                [&>*]:border-b-2 [&>*]:border-orange-100
              ">
                <span className="border-r-2">{item.nome}</span>
                <span className="border-r-2">{item.cognome}</span>
                <span>{nomeDottore}</span>
                <span>
                  <img 
                    src="/fullscreen-icon.png"
                    title="Dettagli documento"
                    className="cursor-pointer object-contain h-1/2 hover:h-4/5 saturate-100"
                    onClick={() => {
                      if (!ingrandisci.show) {
                        setIngrandisci(ing => {
                          const newIng = {...ing};
                          const { data } = supabase
                            .storage
                            .from('screen_portidarmi')
                            .getPublicUrl(`${item.screen}`, 10);
                          // console.log(data, item.screen);
                          
                          newIng.nome = item.nome;
                          newIng.cognome = item.cognome;
                          newIng.screen = item.screen;
                          newIng.url = data.publicUrl;
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
                      eliminaPortoDarmi(item.id, "porti_darmi", "screen_portidarmi", item.screen)
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
            className="flex flex-row justify-evenly w-full mt-5
              [&>label]:text-orange-200 [&>label]:my-auto
              [&>input]:rounded-md [&>input]:px-1 [&>input]:w-3/4 [&>input]:px-1 [&>input]:py-1
              [&>input]:text-xs [&>input]:text-center
            ">
            <label htmlFor="image">Link Foto<br/>(MAX: 150KB)</label>
            <input 
              type="file"
              name="image"
              className="flex self-center text-center"
              onChange={(e) => {
                const myFile = e.target.files[0]
                if (myFile.size > 150000) {
                  alert("I File devono pesare massimo 150 KB")
                  e.target.value = "";
                } else {
                  setFile(myFile);
                }
              }}
            />
          </div>

          <button
            onClick={newPortoDarma}
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

      {notification.show && (
        <NotificationAlert notification={notification} />
      )}

      {ingrandisci.show && (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-1/2 h-fit bg-orange-700 p-4 rounded-lg
          flex flex-col items-center justify-center
        ">
          <span className="mx-auto underline">Dettagli Porto d&apos;armi</span>
          <span>Nome: {ingrandisci.nome}</span>
          <span>Cognome: {ingrandisci.cognome}</span>
          <span>
            <img src={ingrandisci.url} alt="Immagine profilo" 
              className="max-h-[65vh]"
            />
          </span>

          <a href={ingrandisci.url} target="_blank"
            className="max-w-fit mx-auto rounded-lg bg-gray-500 px-4 mt-4
            hover:bg-gray-800
            "
            // onClick={async () => {
            //   const { data } = await supabase
            //     .storage
            //     .from('screen_portidarmi')
            //     .download(`${ingrandisci.screen}`);
            //   console.log(data)
            // }}
            download="test">
            Scarica Referto
          </a>

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
