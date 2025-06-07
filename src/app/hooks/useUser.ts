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
    return {
        getUserLogged
    }
}