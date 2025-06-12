'use client';

// import { useRouter } from 'next/navigation';
// import { useUserContext } from '@/app/context/user/useUserContext';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import Sidemenu from '@/app/components/Sidemenu';
// import { useRestaurantContext } from '@/app/context/selectedRestaurant/selectedRestaurantContext';
// import { toast } from 'react-toastify';
// import { useEffect } from 'react';

// export default function RestaurantesPage() {
//   const { user } = useUserContext();
//   const {selectedRestaurant, setSelectedRestaurant} = useRestaurantContext();
//   const router = useRouter();

//   const handleSelecionar = (id: string) => {
//     setSelectedRestaurant(id);
//     router.push('/dashboard');
//   };

//   const handleCadastrar = () => {
//     router.push('/info');
//   };

//   useEffect(() => {
//     if(!selectedRestaurant) {
//       console.log('Não tem restaurante selecionado')
//       toast.info('Selecione um restaurante para continuar');
//     }
//   }, [selectedRestaurant])

//   if(!user) {
//     router.push('/home')
//     return
//   }

//   return (
//     <div className="flex h-screen">
//       <Sidemenu/>
//       {user.restaurant.length > 0 ? (
//         <div className="flex w-full justify-between">
//         <div className="p-6">
//           <h1 className="text-2xl font-bold mb-6">Meus Restaurantes</h1>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {user.restaurant.map(rest => (
//           <Card key={rest._id} className="p-4">
//             <h2 className="text-lg font-semibold">{rest.name}</h2>
//             <p className="text-sm text-zinc-500">{rest?.address?.street}</p>
//             <Button onClick={() => handleSelecionar(rest._id)} className="mt-4">
//               Selecionar
//             </Button>
//           </Card>
//         ))}
//       </div>

//         </div>
//         <div className="p-6">
//               <Button onClick={handleCadastrar} className="mt-6">
//               Cadastrar Novo Restaurante
//             </Button>
//         </div>
//         </div>
//       ) : (
//         <div className="p-6">
//           <h1 className="text-2xl font-bold mb-6">Meus Restaurantes</h1>
//           <p>Nenhum restaurante encontrado</p>
//         </div>
//       )}
//     </div>
//   );
// }


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Check } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useUserContext } from "@/app/context/user/useUserContext";
import { useRestaurantContext } from "@/app/context/selectedRestaurant/selectedRestaurantContext";
import { Sidemenu } from "@/app/components/Sidemenu";

const SelecionarRestaurante = () => {
  const { user } = useUserContext();
  const {selectedRestaurant, setSelectedRestaurant} = useRestaurantContext();

  useEffect(() => {
    if(!selectedRestaurant) {
      console.log('Não tem restaurante selecionado')
      toast.info('Selecione um restaurante para continuar');
    }
  }, [selectedRestaurant])

  if(!user) {
    return
  }
  
  const handleSelectRestaurant = (restaurantId: string, restaurantName: string) => {
    setSelectedRestaurant(restaurantId);
    toast.success(`Restaurante "${restaurantName}" selecionado!`);
  };

  return (
    <div className="flex min-h-screen">
    <Sidemenu />
    
    <main className="flex-1 p-6 overflow-auto">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Selecionar Restaurante</h1>
        <p className="text-muted-foreground">
          Escolha o restaurante que você deseja gerenciar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.restaurant.map((restaurant) => (
          <Card key={restaurant._id} className={`p-2 cursor-pointer transition-all hover:shadow-lg ${
            selectedRestaurant === restaurant._id ? 'ring-2 ring-primary' : ''
          }`}>
            <CardHeader className="pb-3">
              {true && (
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={"https://plus.unsplash.com/premium_photo-1679503585289-c02467981894?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {restaurant.address.city}, {restaurant.address.state}
                  </div>
                </div>
                {selectedRestaurant === restaurant._id && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Selecionado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant="secondary">{restaurant.type}</Badge>
              </div>
              
              <Button 
                className="w-full"
                variant={selectedRestaurant === restaurant._id ? "default" : "outline"}
                onClick={() => handleSelectRestaurant(restaurant._id, restaurant.name)}
              >
                {selectedRestaurant === restaurant._id ? "Restaurante Atual" : "Selecionar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {user.restaurant.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Nenhum restaurante encontrado</h3>
              <p className="text-muted-foreground">
                Você ainda não possui restaurantes cadastrados.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </main>
    </div>
  );
};

export default SelecionarRestaurante;
