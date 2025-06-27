import { Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";

type TimeInputProps = {
  label: string;
  fieldName: string;
  control: any;
  error?: any;
  required?: boolean;
};

// Função para validar formato de hora (hh:mm)
const validateTimeFormat = (value: string, required: boolean = true) => {
  if (!value && required) return 'Horário é obrigatório';
  if (!value && !required) return true;
  
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(value)) {
    return 'Formato deve ser hh:mm (ex: 08:30, 18:45)';
  }
  return true;
};

export const TimeInput = ({ label, fieldName, control, error, required = true }: TimeInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldName} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={fieldName}
        control={control}
        rules={{
          validate: (value) => validateTimeFormat(value, required)
        }}
        render={({ field }) => (
          <IMaskInput
            {...field}
            id={fieldName}
            mask="00:00"
            placeholder="hh:mm"
            value={field.value || ""}
            unmask={false}
            onAccept={(value) => field.onChange(value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        )}
      />
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
};
