'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidemenu } from '@/app/components/Sidemenu';
import { WorkHoursForm } from '@/app/components/WorkHoursForm'; // Componente separado sugerido

export default function RestauranteInfoPage() {
  const [restaurant, setRestaurant] = useState({
    name: '',
    phone: '',
    description: '',
    type: '',
    maxClients: 0,
    maxReservationTime: 0,
    address: {
      street: '',
      number: '',
      city: '',
      state: '',
      zipCode: '',
    },
    workHours: [],
    menu: null, // PDF
  });

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setRestaurant({ ...restaurant, menu: e.target.files[0] });
  //   }
  // };

  // const handleSubmit = () => {
  //   const formData = new FormData();
  //   for (const key in restaurant) {
  //     if (key === 'menu') {
  //       formData.append('menu', restaurant.menu);
  //     } else if (key === 'address' || key === 'workHours') {
  //       formData.append(key, JSON.stringify(restaurant[key]));
  //     } else {
  //       formData.append(key, String(restaurant[key]));
  //     }
  //   }

  //   // Enviar formData via fetch/axios
  // };

  return (
    <div className="flex h-screen">
      <Sidemenu type="admin" />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Restaurante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome</Label>
                <Input value={restaurant.name} onChange={e => setRestaurant({ ...restaurant, name: e.target.value })} />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input value={restaurant.phone} onChange={e => setRestaurant({ ...restaurant, phone: e.target.value })} />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={restaurant.description} onChange={e => setRestaurant({ ...restaurant, description: e.target.value })} />
              </div>
              <div>
                <Label>Tipo de Comida</Label>
                <Input value={restaurant.type} onChange={e => setRestaurant({ ...restaurant, type: e.target.value })} />
              </div>
              <div>
                <Label>Capacidade Máxima</Label>
                <Input type="number" value={restaurant.maxClients} onChange={e => setRestaurant({ ...restaurant, maxClients: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Tempo máximo de reserva (min)</Label>
                <Input type="number" value={restaurant.maxReservationTime} onChange={e => setRestaurant({ ...restaurant, maxReservationTime: Number(e.target.value) })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Endereço</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Rua" value={restaurant.address.street} onChange={e => setRestaurant({ ...restaurant, address: { ...restaurant.address, street: e.target.value } })} />
                <Input placeholder="Número" value={restaurant.address.number} onChange={e => setRestaurant({ ...restaurant, address: { ...restaurant.address, number: e.target.value } })} />
                <Input placeholder="Cidade" value={restaurant.address.city} onChange={e => setRestaurant({ ...restaurant, address: { ...restaurant.address, city: e.target.value } })} />
                <Input placeholder="Estado" value={restaurant.address.state} onChange={e => setRestaurant({ ...restaurant, address: { ...restaurant.address, state: e.target.value } })} />
                <Input placeholder="CEP" value={restaurant.address.zipCode} onChange={e => setRestaurant({ ...restaurant, address: { ...restaurant.address, zipCode: e.target.value } })} />
              </div>
            </div>

            <div>
              <Label>Horários de Funcionamento</Label>
              <WorkHoursForm workHours={restaurant.workHours} setWorkHours={(data: any) => setRestaurant({ ...restaurant, workHours: data })} />
            </div>

            <div>
              <Label>Cardápio (PDF)</Label>
              <Input type="file" accept="application/pdf" onChange={() => {}} />
            </div>

            <Button onClick={() => {}}>Salvar Alterações</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
