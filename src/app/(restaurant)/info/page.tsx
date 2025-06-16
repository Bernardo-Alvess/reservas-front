'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRestaurant } from "@/app/hooks/useRestaurant";
import { toast } from "react-toastify";
import { Upload, X, ImageIcon, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Sidemenu from '@/app/components/Sidemenu';

const DAYS_OF_WEEK = [
  "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira",
  "Sexta-feira", "Sábado", "Domingo"
];

const Restaurante = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState("");
  const [id, setId] = useState<string>();

  useEffect(() => {
    const id = localStorage.getItem('restauranteSelecionado');
    console.log('useEffect', id)
    setId(id as string);
  }, [])

  const { getRestaurantById } = useRestaurant();

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => getRestaurantById(id as string),
    enabled: !!id
  });

  console.log('restaurant', restaurant)

  const updateRestaurant = ( props: any) => {
    console.log(props)
  }

  const addGalleryImage = (url: string) => {
    console.log(url)
  }

  const removeGalleryImage = (index: number) => {
    console.log(index)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Informações do restaurante atualizadas com sucesso!");
    setIsLoading(false);
  };

  const handleProfileImageUpload = () => {
    // Simular upload de imagem
    const newImageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&t=" + Date.now();
    updateRestaurant({ profileImage: newImageUrl });
    toast.success("Foto de perfil atualizada!");
  };

  const handleAddGalleryImage = () => {
    if (newGalleryImageUrl.trim()) {
      addGalleryImage(newGalleryImageUrl);
      setNewGalleryImageUrl("");
      toast.success("Imagem adicionada à galeria!");
    }
  };

  const handleMenuUpload = () => {
    // Simular upload de PDF
    const newMenuName = "cardapio_atualizado_" + Date.now() + ".pdf";
    updateRestaurant({ menuPdf: newMenuName });
    toast.success("Cardápio atualizado!");
  };

  const updateWorkHours = (index: number, workHour: any) => {
    console.log(index, workHour)
  }

  if(isLoadingRestaurant) return <div>Carregando...</div>
  if(!id) return <div>Carregando por conta do id...</div>

  return (
    <div className="flex h-screen">
      <Sidemenu />
      <main className="flex-1 p-6 space-y-6 overflow-auto bg-zinc-100">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configurações do Restaurante</h1>
            <p className="text-muted-foreground">
              Gerencie as informações e configurações do seu restaurante.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Dados principais do restaurante
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Restaurante</Label>
                    <Input
                      id="name"
                      value={restaurant.name}
                      onChange={(e) => updateRestaurant({ name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={restaurant.phone}
                      onChange={(e) => updateRestaurant({ phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={restaurant.description}
                    onChange={(e) => updateRestaurant({ description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Culinária</Label>
                    <Input
                      id="type"
                      value={restaurant.type}
                      onChange={(e) => updateRestaurant({ type: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxClients">Capacidade Máxima</Label>
                    <Input
                      id="maxClients"
                      type="number"
                      value={restaurant.maxClients}
                      onChange={(e) => updateRestaurant({ maxClients: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxReservationTime">Tempo Máximo de Reserva (min)</Label>
                    <Input
                      id="maxReservationTime"
                      type="number"
                      value={restaurant.maxReservationTime}
                      onChange={(e) => updateRestaurant({ maxReservationTime: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>
                  Localização do restaurante
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      value={restaurant.address.street}
                      onChange={(e) => updateRestaurant({ 
                        address: { ...restaurant.address, street: e.target.value }
                      })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      value={restaurant.address.number}
                      onChange={(e) => updateRestaurant({ 
                        address: { ...restaurant.address, number: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={restaurant.address.neighborhood}
                      onChange={(e) => updateRestaurant({ 
                        address: { ...restaurant.address, neighborhood: e.target.value }
                      })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={restaurant.address.complement || ""}
                      onChange={(e) => updateRestaurant({ 
                        address: { ...restaurant.address, complement: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={restaurant.address.city}
                      onChange={(e) => updateRestaurant({ 
                        address: { ...restaurant.address, city: e.target.value }
                      })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={restaurant.address.state}
                      onChange={(e) => updateRestaurant({ 
                        address: { ...restaurant.address, state: e.target.value }
                      })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={restaurant.address.zipCode}
                      onChange={(e) => updateRestaurant({ 
                        address: { ...restaurant.address, zipCode: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horários de Funcionamento */}
            <Card>
              <CardHeader>
                <CardTitle>Horários de Funcionamento</CardTitle>
                <CardDescription>
                  Defina os horários de abertura e fechamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {restaurant.workHours.map((workHour: any, index: number) => (
                  <div key={workHour.day} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label>{workHour.day}</Label>
                      <Input value={workHour.day} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`open-${index}`}>Abertura</Label>
                      <Input
                        id={`open-${index}`}
                        type="time"
                        value={workHour.open}
                        onChange={(e) => updateWorkHours(index, { ...workHour, open: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`close-${index}`}>Fechamento</Label>
                      <Input
                        id={`close-${index}`}
                        type="time"
                        value={workHour.close}
                        onChange={(e) => updateWorkHours(index, { ...workHour, close: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Foto de Perfil */}
            <Card>
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>
                  Imagem principal do restaurante
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  {restaurant.profileImage && (
                    <img
                      src={restaurant.profileImage}
                      alt="Foto de perfil"
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  )}
                  <Button type="button" variant="outline" onClick={handleProfileImageUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    Alterar Foto de Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Galeria de Imagens */}
            <Card>
              <CardHeader>
                <CardTitle>Galeria de Imagens</CardTitle>
                <CardDescription>
                  Adicione ou remova fotos do restaurante
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="URL da imagem"
                    value={newGalleryImageUrl}
                    onChange={(e) => setNewGalleryImageUrl(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={handleAddGalleryImage}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {restaurant.gallery.map((image: any, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Galeria ${index + 1} ${image.url}`}
                        className="w-full h-24 rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cardápio */}
            <Card>
              <CardHeader>
                <CardTitle>Cardápio</CardTitle>
                <CardDescription>
                  Upload do cardápio em formato PDF
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  {restaurant.menuPdf && (
                    <div className="flex items-center space-x-2 p-2 border rounded-lg">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{restaurant.menuPdf}</span>
                    </div>
                  )}
                  <Button type="button" variant="outline" onClick={handleMenuUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    {restaurant.menuPdf ? "Alterar Cardápio" : "Adicionar Cardápio"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Restaurante;