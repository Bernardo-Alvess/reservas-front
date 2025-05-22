import Header from './components/Header'
import './globals.css'

export const metadata = {
  title: 'Sistema de Reservas',
  description: 'Encontre e reserve os melhores restaurantes',
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" >
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}

