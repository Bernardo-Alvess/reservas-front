'use client'

import { useRouter } from "next/navigation";

export interface Restaurant {
  _id: string;
  name: string;
  address: Address;
  phone: string;
  capacity: number;
}

export interface Address {
  street: string;
  number: string;
  district: string;
  city: string;
  complement: string;
  state: string;
  zipCode: string;
}

interface Props {
  restaurants: Restaurant[]
}

export function RestaurantList({ restaurants }: Props) {
  const router = useRouter()

  const handleClick = (id: string) => {
    router.push(`/restaurant/${id}`)
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Restaurantes Cadastrados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition cursor-pointer"
            onClick={() => handleClick(restaurant._id)}
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {restaurant.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{restaurant.address.street}, {restaurant.address.number}</p>
            <p className="text-sm text-gray-600 mb-1">Tel: {restaurant.phone}</p>
            <p className="text-sm text-gray-600">
              Capacidade: {restaurant.capacity} pessoas
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
