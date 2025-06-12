export const formatDate = (dateString: string) => {
  console.log('dateString')
  console.log(dateString)
  return new Date(dateString).toLocaleDateString('pt-BR');
};


export const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};