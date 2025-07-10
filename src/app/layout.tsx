import Header from '../components/Header'
import './globals.css'
import { Providers } from './providers'
export const metadata = {
  title: 'ReservaFácil',
  description: 'Encontre e reserve os melhores restaurantes',
  icons: {
    icon: './favicon.ico'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className='text-black antialiased'>
        <Providers>
          <Header />
          {children}
        </Providers>
    </html>
  )
}