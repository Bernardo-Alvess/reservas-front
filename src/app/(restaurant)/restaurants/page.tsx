'use client';


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Check, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useUserContext } from "@/app/context/user/useUserContext";
import { useRestaurantContext } from "@/app/context/selectedRestaurant/selectedRestaurantContext";
import { Sidemenu } from "@/components/Sidemenu";
import CreateRestaurantDialog from "@/components/CreateRestaurantDialog";

const SelecionarRestaurante = () => {
  const { user } = useUserContext();
  const {selectedRestaurant, setSelectedRestaurant} = useRestaurantContext();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if(user?.restaurant.length === 1) {
      setSelectedRestaurant(user.restaurant[0]._id);
      return;
    }
    const initialRestaurant = localStorage.getItem('restauranteSelecionado');
    if(initialRestaurant) {
      setSelectedRestaurant(initialRestaurant);
    } else {
      setSelectedRestaurant(null);
    }
    
    // Só mostrar toast se usuário é company e tem múltiplos restaurantes
    if(!selectedRestaurant && user && user.type === 'company' && user.restaurant.length > 1) {
      toast.info('Selecione um restaurante para continuar');
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Selecionar Restaurante</h1>
          <p className="text-muted-foreground">
            {user && user.type !== 'company' && user.restaurant.length === 1 
              ? 'Seu restaurante está selecionado automaticamente.' 
              : 'Escolha o restaurante que você deseja gerenciar.'
            }
          </p>
        </div>
        {user && user.type === 'company' && (
          <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Restaurante
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.restaurant.map((restaurant) => (
          <Card key={restaurant._id} className={`p-2 cursor-pointer transition-all hover:shadow-lg ${
            selectedRestaurant === restaurant._id ? 'ring-2 ring-primary' : ''
          }`}>
            <CardHeader className="pb-3">
              {restaurant.profileImage ? (
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={restaurant.profileImage.url}
                    alt={restaurant.profileImage.url}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) :  (
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={'/images/image-placeholder.jpg'}
                    alt="Imagem do restaurante"
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
    <CreateRestaurantDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
};

export default SelecionarRestaurante;
