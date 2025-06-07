'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export interface WorkHours {
  day: string;
  open: string;
  close: string;
}

interface WorkHoursFormProps {
  workHours: WorkHours[];
  setWorkHours: (data: WorkHours[]) => void;
}

const daysOfWeek = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

export function WorkHoursForm({ workHours, setWorkHours }: WorkHoursFormProps) {
  const [newEntry, setNewEntry] = useState<WorkHours>({
    day: '',
    open: '',
    close: '',
  });

  const addWorkHour = () => {
    if (!newEntry.day || !newEntry.open || !newEntry.close) return;

    const alreadyExists = workHours.find(w => w.day === newEntry.day);
    if (alreadyExists) {
      alert('Dia já adicionado.');
      return;
    }

    setWorkHours([...workHours, newEntry]);
    setNewEntry({ day: '', open: '', close: '' });
  };

  const removeWorkHour = (day: string) => {
    setWorkHours(workHours.filter(w => w.day !== day));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Dia</Label>
          <select
            className="w-full border rounded px-2 py-1"
            value={newEntry.day}
            onChange={(e) => setNewEntry({ ...newEntry, day: e.target.value })}
          >
            <option value="">Selecione o dia</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Abertura</Label>
          <Input
            type="time"
            value={newEntry.open}
            onChange={(e) => setNewEntry({ ...newEntry, open: e.target.value })}
          />
        </div>
        <div>
          <Label>Fechamento</Label>
          <Input
            type="time"
            value={newEntry.close}
            onChange={(e) => setNewEntry({ ...newEntry, close: e.target.value })}
          />
        </div>
      </div>

      <Button onClick={addWorkHour}>Adicionar horário</Button>

      <div className="space-y-2">
        {workHours.length === 0 && <p className="text-muted">Nenhum horário adicionado.</p>}
        {workHours.map((wh, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-muted px-3 py-2 rounded"
          >
            <p>
              <strong>{wh.day}</strong>: {wh.open} - {wh.close}
            </p>
            <Button variant="destructive" size="sm" onClick={() => removeWorkHour(wh.day)}>
              Remover
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
