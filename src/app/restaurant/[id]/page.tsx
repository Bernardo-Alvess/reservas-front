'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Users, ArrowLeft, ChefHat, BookOpenText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRestaurant } from "@/app/hooks/useRestaurant";
import { useQuery } from "@tanstack/react-query";
import { ReservationModal } from "@/components/ReservationModal";
import { useUserContext } from "@/app/context/user/useUserContext";
import { mapDay } from "@/lib/mapDay";
import { LoginModal } from "@/components/LoginModal";
import { MenuModal } from "@/components/MenuModal";

const RestaurantPage = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { getRestaurantById } = useRestaurant();

  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => getRestaurantById(id as string),
  });

  return (
    <div className="min-h-screen bg-background">
      {isLoading ? (<div>Carregando...</div>) : (
        <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à busca
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="relative h-96 rounded-xl overflow-hidden mb-8">
        <img
          src={restaurant?.profileImage?.url || '/images/image-placeholder.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
         <div className="absolute inset-0 bg-black/40 flex items-end">
      <div className="p-8 w-fit">
        <div className="bg-black/35 p-4 rounded-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="ml-2">{restaurant.type}</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-lg opacity-90 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {restaurant.address.city}, {restaurant.address.district}, {restaurant.address.street}, {restaurant.address.number}
          </p>
        </div>
      </div>
     </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-2">
            <CardHeader>
              <CardTitle>Sobre o Restaurante</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{restaurant.description}</p>
              
              <div className="flex gap-10">
               {restaurant.menu && (
                 <div 
                   className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors border border-primary rounded-md p-2"
                   onClick={() => setMenuModalOpen(true)}
                 >
                   <BookOpenText className="w-4 h-4" />
                   <span>Visualizar cardápio</span>
                 </div>
               )}
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  {restaurant.phone}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ChefHat className="w-4 h-4" />
                  {restaurant.type}
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Gallery */}
          {restaurant?.gallery.length > 0 && (
          <Card className="p-2">
            <CardHeader>
              <CardTitle>Galeria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {restaurant?.gallery.map((image: Record<string, string>, index: number) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={`${restaurant.name} - Foto ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
            </Card>
          )}

          {/* Hours */}
          {restaurant?.workHours && restaurant.workHours.length > 0 && (
            <Card className="p-2">
              <CardHeader>
                <CardTitle>Horário de Funcionamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {restaurant.workHours.map((workHour: any) => (
                    <div key={workHour.day} className="flex justify-between">
                      <span className="font-medium">{mapDay(workHour.day)}</span>
                      <span className="text-muted-foreground">
                        {workHour.open} - {workHour.close}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reservation Card */}
          <Card className="px-2 py-3">
            <CardHeader>
              <CardTitle>Fazer Reserva</CardTitle>
              <CardDescription>
                Reserve sua mesa agora mesmo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className={`w-full ${restaurant.tables.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
                size="lg"
                onClick={() => {
                  if (!user) {
                    setLoginModalOpen(true);
                  } else if (restaurant.tables.length === 0) {
                    return
                  } else {
                    setReservationModalOpen(true);
                  }
                }}
                // disabled={(!user || restaurant.tables.length === 0)}
              >
                <Users className="w-4 h-4 mr-2" />
                {restaurant.tables.length === 0 ? 'Não há mesas disponíveis' : user ? 'Reservar Mesa' : 'Faça login para reservar'}
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="px-2 py-3">
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{restaurant.address.city}, {restaurant.address.district}, {restaurant.address.street}, {restaurant.address.number}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{restaurant.phone}</span>
              </div>
              {/* <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{restaurant.website || 'Não possui site'}</span>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

      <ReservationModal
        open={reservationModalOpen}
        onOpenChange={setReservationModalOpen}
        restaurant={{ 
          id: restaurant._id, 
          name: restaurant.name,
          workHours: restaurant.workHours 
        }}
      />

      <MenuModal
        open={menuModalOpen}
        onOpenChange={setMenuModalOpen}
        menuUrl={restaurant?.menu?.url || ""}
        restaurantName={restaurant?.name || ""}
      />
      <LoginModal
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
      />
    </>
    )}

    </div>
  );
};

export default RestaurantPage;
