'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  // const verifySessionToken = async (sessionToken: string) => {
  //   if (sessionToken) {
  //     const payload = await verifyToken(sessionToken)
  //     if (payload?.type === 'client') {
  //       router.push('/home')
  //     }
  //   }
  // }

  // useEffect(() => {
  //   // Verifica se existe algum token de autenticação
  //   const hasSessionToken = document.cookie.includes('sessionToken')
  //   const hasSessionTokenR = document.cookie.includes('sessionTokenR')

  //   const sessionToken = getCookie('sessionToken')
    
  //   if(sessionToken) {
  //     verifySessionToken(sessionToken)
  //   }

  //   if (!hasSessionToken && !hasSessionTokenR) {
  //     router.push('/home')
  //   }
  // }, [router])

  return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
  )
}
