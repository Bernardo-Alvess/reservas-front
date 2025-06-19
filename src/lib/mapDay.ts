const dayMap = new Map([
  ["MONDAY", "Segunda-feira"],
  ["TUESDAY", "Terça-feira"],
  ["WEDNESDAY", "Quarta-feira"],
  ["THURSDAY", "Quinta-feira"],
  ["FRIDAY", "Sexta-feira"],
  ["SATURDAY", "Sábado"],
  ["SUNDAY", "Domingo"],
]);

export const mapDay = (day: string) => {
  const dayInUpperCase = day.toUpperCase();
  return dayMap.get(dayInUpperCase) || day;
}
