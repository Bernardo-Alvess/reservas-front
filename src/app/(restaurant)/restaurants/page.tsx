'use client';

import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/context/user/useUserContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidemenu from '@/app/components/Sidemenu';

export default function RestaurantesPage() {
  const { user } = useUserContext();
  const router = useRouter();

  const handleSelecionar = (id: string) => {
    localStorage.setItem('restauranteSelecionado', id);
  };

  const handleCadastrar = () => {
    router.push('/info');
  };

  if (!user?.restaurant?.length) {
    return <p>Nenhum restaurante encontrado.</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidemenu type="company" />
      <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Meus Restaurantes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.restaurant.map(rest => (
          <Card key={rest.id} className="p-4">
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
