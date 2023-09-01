"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import NotificationAlert from "../notification-alert/page";


export default function UsersView({ listaProfili }) {
  const supabase = createClientComponentClient();
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const router = useRouter();
  //console.log("tst", listaProfili, listaProfili[0].direttore);
  const [name, setName] = useState({
    user: null,
    name: null
  })
  const [handleNameEdit, setHandleNameEdit] = useState({
    show: false,
    name: null
  })

  const [sexRole, setSexRole] = useState({
    user: null,
    role: null
  })

  const [hospitalRole, setHospitalRole] = useState({
    user: null,
    role: null
  });

  const [discordInfo, setDiscordInfo] = useState({
    discord_id: "",
    discord_full_name: ""
  })

  const getInfo = (user) => {
    setDiscordInfo({
      discord_id: user.discord_id,
      discord_full_name: user.discord_full_name
    })
  }

  const resetInfo = () => {
    setDiscordInfo({
      discord_id: '',
      discord_full_name: ''
    })
  }

  // useEffect to edit SEX select
  useEffect(() => {
    if(!sexRole["user"]) return;
    if(!listaProfili.acceptableSex.includes(sexRole["role"])) return;
    if(sexRole["role"].toLowerCase() == sexRole["user"].sesso.toUpperCase()) return;
    
    async function changeRole () {
      await supabase.from('profili').update({ sesso: sexRole['role']}).eq('id', sexRole["user"]["id"])
    }
    changeRole();
  }, [sexRole["role"]]);

  // useEffect to edit the HOPSITAL ROLE 
  useEffect(() => {
    // console.log("useEffect Start - hospitalRole: ", hospitalRole)
    if(!hospitalRole["user"]) return;
    if(!listaProfili.acceptableRoles.includes(hospitalRole["role"])) return;
    if(hospitalRole["role"].toLowerCase() == hospitalRole["user"].ruolo.toLowerCase()) return;
    
    async function changeRole () {
      await supabase.from('profili').update({ ruolo: hospitalRole['role']}).eq('id', hospitalRole["user"]["id"])
    }
    changeRole();
  }, [hospitalRole["role"]])


  async function handleNameSubmit(e) {
    e.preventDefault();
    if (!name["user"]) return;
    if (name["name"] == name["user"].nome) return;

    try {
      await supabase.from('profili').update({ nome: name['name']}).eq('id', name["user"]["id"])
      setHandleNameEdit(false);
      setNotification({ show: true, message: "Nome aggiornato correttamente!" });
      setTimeout(() => {
        setNotification({ show: false, message: "" });
      }, 4000);
      router.refresh();
    } catch(e) {
      setNotification({ show: true, message: "Errore. Riprovare o contattare un amministratore!" });
      setTimeout(() => {
        setNotification({ show: false, message: "" });
      }, 4000);
    }
    
  }

  return (
    <div className="mx-auto mt-5 overflow-none">
      <div className="h-[88vh] w-[70vw]">
        <div className="flex flex-row h-16 items-center
            [&>*]:text-center [&>*]:w-[100%] [&>*]:h-[100%]
            [&>*]:text-base [&>*]:my-auto [&>*]:flex [&>*]:items-center [&>*]:justify-center [&>*]:whitespace-pre-wrap
            [&>*]:border-b-2 [&>*]:border-orange-100

            [&>*]:text-lg [&>*]:text-orange-900 [&>*]:font-bold [&>*]:break-words [&>*]:whitespace-break-spaces
          ">
          <span></span>
          <span className="border-r-2">Nome Completo</span>
          <span className="border-r-2">Sesso</span>
          <span className="border-r-2">Ruolo</span>
          <span className="border-r-2">Direttore</span>
          <span className="border-r-2">Discord</span>
          <span></span>
        </div>

        <div className="overflow-auto no-scrollbar max-h-[91%]">
          {listaProfili.lista.map((user) => {
            return (
              <div key={user.id} className="flex flex-row items-center justify-around 
                flex flex-row h-16 items-center text-black
                [&>*]:text-center [&>span]:w-[100%] [&>span]:h-[100%]
                [&>*]:text-base [&>*]:my-auto [&>*]:flex [&>*]:items-center [&>*]:justify-center [&>*]:whitespace-pre-wrap
                [&>*]:border-b-2 [&>*]:border-orange-100
              ">       
                <span className="border-r-2">
                  <Image
                    src={user.discord_avatar_url}
                    alt="Discord avatar"
                    width={10}
                    height={10}
                    className="w-8 rounded-full"
                  />
                </span>
                <span className="border-r-2">
                  <span>
                    {user.nome}
                  </span>
                </span>

                <span className="border-r-2">
                  {!user.direttore && <select onChange={async (e) => {
                      setSexRole({user: user, role: e.target.value.toUpperCase()});
                      router.refresh();
                    }}
                    value={user.sesso.toUpperCase()}
                    disabled={user.direttore}
                    className="rounded-md w-full text-center bg-orange-300"
                    >
                    <option value=""></option>
                    <option value="M" >M</option>
                    <option value="F" >F</option>
                  </select>}
                </span>
                
                <span className="border-r-2">
                  {!user.direttore && 
                    <select onChange={async (e) => {
                        setHospitalRole({user: user, role: e.target.value.toLowerCase()});
                        router.refresh();
                      }}
                      value={user.ruolo.toLowerCase()}
                      disabled={user.direttore}
                      className="rounded-md w-full bg-orange-300"
                    >
                      <option value="cliente" >Cliente</option>
                      <option value="infermiere" >Infermiere</option>
                      <option value="medico" >Medico</option>
                      <option value="primario" >Primario</option>
                  </select> }
                </span>

                <span className="border-r-2">
                  <img 
                    src={user.direttore ? 
                          '/accept-icon.png' : '/deny-icon.png'}
                    alt='IMG Direttore'
                    className="h-2/3 object-contain"
                  />
                </span>

                <span className="border-r-2">
                  <img src="/info-icon.png"
                    className="cursor-pointer object-contain h-1/3 hover:h-3/5"
                    style={{'transform': 'rotateY(180deg)'}}
                    onClick={ () => {getInfo(user)} }
                  />
                </span>
              
                <span>
                  <img src="/edit-icon.png"
                    className="cursor-pointer object-contain h-1/3 hover:h-3/5"
                    onClick={() => 
                      setHandleNameEdit({show: true, name: user.nome}) 
                    }
                  />
                </span>
                
                {(handleNameEdit["name"]==user.nome) && 
                  <form 
                    className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-orange-700 p-4 rounded-lg
                      flex flex-col items-center justify-center
                    "
                    onSubmit={async (e) => {
                      await handleNameSubmit(e);
                    }}>

                    <img src="/x-icon-black-2.png"
                      onClick={() => {
                        resetInfo();
                        setHandleNameEdit({user: null, name: null})
                      }}
                      className="absolute right-2 top-2 cursor-pointer h-[1.5rem] invert
                      hover:blur-sm"
                    />

                    <span className="text-white mb-3 mt-4">
                      Inserisci il nuovo nome per <u>{user.nome}</u> e premi Enter
                    </span>
                    <input 
                      type="text 
                      "title="Premi ENTER per confermare"
                      onChange={async (e) => {
                        setName({user: user, name: e.target.value});
                      }}
                      className="bg-orange-300 text-black"
                      placeholder={user.nome}
                    />
                  </form>
                }
              </div>
            )
          })}
        </div>
      </div>

      {discordInfo["discord_id"] !== "" && (
        <div className="
          absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-gray-600 rounded-lg px-2 py-1
          flex flex-col bg-orange-700 rounded-lg py-5 px-5 gap-3 text-base
          ">
          
          <img src="/x-icon-black-2.png"
            onClick={() => {
              resetInfo()
            }}
            className="absolute right-2 top-2 cursor-pointer h-[1.5rem] invert
            hover:blur-sm"
          />

          <span className="text-center underline">
            Dettagli Discord
          </span>
          <span>Nome discord: {discordInfo["discord_full_name"]}</span>
          <span>Discord ID: {discordInfo["discord_id"]}</span>

          
        </div>)
      }

      {notification.show && (
        <NotificationAlert notification={notification} />
      )}

      
    </div>
  );
}
