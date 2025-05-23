import { API_URL } from '../configs/constants';
import { getUserInfoFromToken, verifyToken } from '@/middleware';
export const useReserve = () => {
	const getReservesForUser = async () => {
		try {
			const response = await fetch(`${API_URL}reserve/client`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Erro ao buscar reservas:', error);
			throw error;
		}
	};

	return {
		getReservesForUser,
	};
};
