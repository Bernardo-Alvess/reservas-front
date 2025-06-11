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
      <body>
        <Providers>
          <Header />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="colored"
            transition={Bounce}
            />
          {children}
        </Providers>
      </body>
    </html>
  )
}