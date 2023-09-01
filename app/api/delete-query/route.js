import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profili")
        .select()
        .eq("id", user.id)
        .limit(1);
      const profile = data[0];

      // console.log(profile.ruolo);
      if (
        profile.nome == "" ||
        profile.sesso == "" ||
        profile.nome == null ||
        profile.sesso == null
      ) {
        return NextResponse.json(
          { error: "Internal Server Error" },
          {
            status: 510,
            statusText:
              "Profilo Utente non completo. Contatta un Direttore per completare il tuo profilo!",
          }
        );
      }
      

      if (profile.ruolo === "cliente" || 
        profile.ruolo === "infermiere" || 
        profile.ruolo === "medico" ||
        profile.ruolo === "primario") {
        if (!profile.direttore ) {
          return NextResponse.json(
            { error: "Internal Server Error" },
            {
              status: 520,
              statusText:
                "Non hai l'autorizzazione per utilizzare questa funzione. Contatta un Direttore!",
            }
          );
        }
      }

      const obj = await request.json();
      const result = await supabase.from(obj.table)
        .delete()
        .eq('id', obj.id);
      // console.log(result, obj.id, obj.table, obj)

      if (obj.storage !== null && obj.storage !== "") {
        const { data, error } = await supabase.storage
          .from(obj.storage)
          .remove([obj.screen])
        // console.log(data, error)
      }
      if (result.error !== null) {
        return NextResponse.json(
          { error: "Internal Server Error" },
          {
            status: 525,
            statusText: "Modulo NON inviato. Campi inseriti non validi!",
          }
        );
      }

      return NextResponse.json(
        { error: null },
        {
          status: 200,
          statusText: "Modulo Eliminato correttamente!",
        }
      );
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        {
          status: 560,
          statusText:
            "Utente non loggato!. Devi essere loggato per poter utilizzare il sito!",
        }
      );
    }
  } catch (err) {
    // console.log(err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 550,
        statusText: "Errore inaspettato. Riprova o contatta un amministratore",
      }
    );
  }

  // return NextResponse.redirect(new URL('/', request.url).origin, {
  //   status: 302,
  // })
}