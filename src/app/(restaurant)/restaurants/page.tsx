'use client';

import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/context/user/useUserContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidemenu from '@/app/components/Sidemenu';
import { useRestaurantContext } from '@/app/context/selectedRestaurant/selectedRestaurantContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export default function RestaurantesPage() {
  const { user } = useUserContext();
  const {selectedRestaurant, setSelectedRestaurant} = useRestaurantContext();
  const router = useRouter();

  const handleSelecionar = (id: string) => {
    setSelectedRestaurant(id);
    router.push('/dashboard');
  };

  const handleCadastrar = () => {
    router.push('/info');
  };

  useEffect(() => {
    if(!selectedRestaurant) {
      console.log('Não tem restaurante selecionado')
      toast.info('Selecione um restaurante para continuar');
    }
  }, [selectedRestaurant])

  if (!user?.restaurant?.length) {
    return <p>Nenhum restaurante encontrado.</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidemenu/>
      <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Meus Restaurantes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.restaurant.map(rest => (
          <Card key={rest._id} className="p-4">
            <h2 className="text-lg font-semibold">{rest.name}</h2>
            <p className="text-sm text-zinc-500">{rest?.address?.street}</p>
            <Button onClick={() => handleSelecionar(rest._id)} className="mt-4">
              Selecionar
            </Button>
          </Card>
        ))}
      </div>
      <Button onClick={handleCadastrar} className="mt-6">
        Cadastrar Novo Restaurante
      </Button>
    </div>
    </div>
    
  );
}
