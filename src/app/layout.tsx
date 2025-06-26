import Header from '../components/Header'
import './globals.css'
import { Providers } from './providers'
import { Bounce, ToastContainer} from 'react-toastify';
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
    <html lang="pt-BR" className='text-black antialiased'>
        <Providers>
          <Header />
          {children}
        </Providers>
    </html>
  )
}