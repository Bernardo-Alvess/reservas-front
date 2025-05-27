import { useForm } from 'react-hook-form';
import { API_URL } from '../configs/constants';
import reserveSchema from '../schemas/reserve/reserveSchema';
import { zodResolver } from '@hookform/resolvers/zod';	
import { Reserve } from '../schemas/reserve/reserve';

export const useReserve = () => {

	const methods = useForm(
		{
			resolver: zodResolver(reserveSchema),
			defaultValues: {
				startTime: '',
				endTime: '',
				amountOfPeople: 1,
				cpf: '',
				birthDate: '',
			}
		}
	)

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

	const createReserve = async (data: Reserve) => {
		try {
			const response = await fetch(`${API_URL}reserve`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(data),
			});
			if(!response.ok) {
				throw new Error('Erro ao criar reserva');
			}

			return 'Reserva criada com sucesso';
		} catch (error) {
			console.error('Erro ao criar reserva:', error);
			return 'Erro ao criar reserva';
		}	
	}

	return {
		methods,
		getReservesForUser,
		createReserve,
	};
};
