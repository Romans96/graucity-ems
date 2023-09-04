'use client'

import { useEffect, useState } from "react"

export default function NotificationAlert({ notification }) {
    const [notifyMessage, setNotifyMessage] = useState(null);
    // console.log(notifyMessage)
    useEffect(() => {
      setNotifyMessage(notification.message);
    }, [notification])

    return (
        <div className="absolute z-[100] right-1 top-1 w-40 h-fit py-3 px-1 text-center text-xs
          bg-slate-800 rounded-md border border-2 border-sky-200">
          <p className="whitespace-pre-wrap mx-auto my-auto">{notifyMessage}</p>
        </div>
    )
}