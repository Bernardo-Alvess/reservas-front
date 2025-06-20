const dayMap = new Map([
  ["MONDAY", "Segunda-feira"],
  ["TUESDAY", "Terça-feira"],
  ["WEDNESDAY", "Quarta-feira"],
  ["THURSDAY", "Quinta-feira"],
  ["FRIDAY", "Sexta-feira"],
  ["SATURDAY", "Sábado"],
  ["SUNDAY", "Domingo"],
]);

const reverseDayMap = new Map([
  ["segunda-feira", "MONDAY"],
  ["terça-feira", "TUESDAY"],
  ["quarta-feira", "WEDNESDAY"],
  ["quinta-feira", "THURSDAY"],
  ["sexta-feira", "FRIDAY"],
  ["sábado", "SATURDAY"],
  ["domingo", "SUNDAY"],
]);

export const mapDay = (day: string) => {
  const dayInUpperCase = day.toUpperCase();
  return dayMap.get(dayInUpperCase) || day;
}

export const reverseMapDay = (day: string) => {
  const dayInLowerCase = day.toLowerCase();
  return reverseDayMap.get(dayInLowerCase) || day;
}

