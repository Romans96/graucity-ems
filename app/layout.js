import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Grau City EMS',
  description: 'Sito Ufficiale dell\'EMS di Grau City Life V6',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen min-w-screen flex overflow-hidden box-border bg-orange-300">{children}</div>
      </body>
    </html>
  )
}
