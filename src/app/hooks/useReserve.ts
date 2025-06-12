import { useForm } from 'react-hook-form';
import { API_URL } from '../configs/constants';
import reserveSchema from '../schemas/reserve/reserveSchema';
import { zodResolver } from '@hookform/resolvers/zod';	
import { Reserve } from '../schemas/reserve/reserve';
import { toast } from 'react-toastify';
import { PageOptionsDto } from '@/lib/PageOptionsDto';

export const useReserve = () => {

	const methods = useForm(
		{
			defaultValues: {
				startDate: '',
				startTime: '',
				amountOfPeople: 1,
				email: '',
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
			console.log(data)
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
				toast.error('Ocorreu um erro ao criar a reserva');
				throw new Error('Erro ao criar reserva');
			}

			toast.success('Reserva realizada com sucesso');

			return true
		} catch (error) {
			console.error('Erro ao criar reserva:', error);
			return false;
		}	
	}

	const confirmOrCancelReserve = async (reserveId: string, type: 'restaurant' | 'client', mode: 'confirm' | 'cancel') => {
		try {
			const response = await fetch(`${API_URL}reserve/${mode}/${type}/${reserveId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			if(!response.ok) {
				throw new Error('Erro ao confirmar reserva');
			}
			console.log('reserva confirmada com sucesso')
			return 'Reserva confirmada com sucesso';
		} catch (error) {
			console.error('Erro ao confirmar reserva:', error);
			return 'Erro ao confirmar reserva';
		}
	}

	const getReservesForRestaurant = async (options?: PageOptionsDto) => {
		try {
			const id = localStorage.getItem('restauranteSelecionado');
			let url = `${API_URL}reserve/restaurant/${id}`;
			const queryParams = new URLSearchParams();
			if(options) {
				if(options.orderDirection) queryParams.append('orderDirection', options.orderDirection);
				if(options.orderColumn) queryParams.append('orderColumn', options.orderColumn);
				if(options.page) queryParams.append('page', options.page.toString());
				if(options.limit) queryParams.append('limit', options.limit.toString());
				if(options.search) queryParams.append('search', options.search);
				url = `${url}?${queryParams.toString()}`;
			}
			console.log(id)
			console.log(url)
			
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if(!response.ok) {
				toast.error('Ocorreu um erro ao buscar as reservas');
				throw new Error('Erro ao buscar reservas');
			}

			const data = await response.json();


			console.log(data)
			return data;
		} catch (error) {
			console.error('Erro ao buscar reservas:', error);
			throw error;
		}
	}

	return {
		methods,
		getReservesForUser,
		createReserve,
		confirmOrCancelReserve,
		getReservesForRestaurant,
	};
};
