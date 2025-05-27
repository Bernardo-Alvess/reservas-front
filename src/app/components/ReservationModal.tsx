'use client'

import React from 'react'
import { useReserve } from '../hooks/useReserve'
import { useParams } from 'next/navigation'
import { useCookies } from 'react-cookie'
import { useUser } from '../hooks/useUser'
import { useQuery } from '@tanstack/react-query'

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const { methods, createReserve } = useReserve()
  const { getUserLogged } = useUser()
  const { id } = useParams()
  const [cookie, setCookie] = useCookies(['sessionToken'])
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = methods

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUserLogged
  })

  console.log(user)

  const onSubmit = async (data: any) => {
    console.log(data)
    data.restaurantId = id as string
    try {
      const response = await createReserve(data)
      console.log('Reserva criada:', response)
      reset()
      onClose()
    } catch (error) {
      console.error('Erro ao criar reserva:', error)
    }
  }


  if (!isOpen) return null

  return (
    user === undefined ? (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            type="button"
          >
            ✕
          </button>
          <p className='text-center text-black'>AINDA NAO IMPLEMENTADO PARA SEM LOGIN</p>
            </div>
      </div>
    ) : (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            type="button"
          >
            ✕
          </button>
  
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Realizar Reserva</h2>
  
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">email</label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                value={user?.email}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
              <input
                type="datetime-local"
                {...register('startTime')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                  errors.startTime ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
              {errors.startTime && <p className="text-red-600 text-sm mt-1">{errors.startTime.message}</p>}
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Término</label>
              <input
                type="datetime-local"
                {...register('endTime')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                  errors.endTime ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
              {errors.endTime && <p className="text-red-600 text-sm mt-1">{errors.endTime.message}</p>}
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de Pessoas</label>
              <input
                type="number"
                {...register('amountOfPeople', { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                  errors.amountOfPeople ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
              {errors.amountOfPeople && <p className="text-red-600 text-sm mt-1">{errors.amountOfPeople.message}</p>}
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                type="text"
                {...register('cpf')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                  errors.cpf ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
              {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf.message}</p>}
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <input
                type="date"
                {...register('birthDate')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                  errors.birthDate ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
              {errors.birthDate && <p className="text-red-600 text-sm mt-1">{errors.birthDate.message}</p>}
            </div>
  
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 rounded-lg transition"
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar Reserva'}
            </button>
          </form>
        </div>
      </div>
    )
  )
}

export default ReservationModal
