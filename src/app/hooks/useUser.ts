import { toast } from "react-toastify"
import { API_URL } from "../configs/constants"

export const useUser = () => {
    const getUserLogged = async () => {
        try {
            const response = await fetch(`${API_URL}users/me`,
                {
                    method: 'GET',
                    credentials: 'include',
                },
            )
            if (!response.ok) {
                throw new Error('Erro ao obter usuário logado')
            }
            const data = await response.json()
            return data || null
        }catch(error){
            console.error('Erro ao obter usuário logado:', error)
            throw error
        }
    }

    const createOrUpdateOtp = async (email: string) => {
        console.log('email', email)
        try {
            const response = await fetch(`${API_URL}users/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })
            if (!response.ok) {
                throw new Error('Erro ao criar ou atualizar OTP')
            }
            const data = await response.json()
            toast.success("Código enviado para seu email!");
            return data || null
        }catch(error){
            console.error('Erro ao criar ou atualizar OTP:', error)
            throw error
        }

    }

    return {
        getUserLogged,
        createOrUpdateOtp
    }
}