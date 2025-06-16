import { Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";

type TimeInputProps = {
  label: string;
  fieldName: string;
  control: any;
  error?: any;
};

export const TimeInput = ({ label, fieldName, control, error }: TimeInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldName}>{label}</label>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <IMaskInput
            {...field}
            id={fieldName}
            mask="00:00"
            placeholder="hh:mm"
            value={field.value || ""}
            unmask={false}
            onAccept={(value) => field.onChange(value)}
            className="border p-2 rounded"
          />
        )}
      />
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
};
