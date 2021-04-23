export function convertDurationToTimeString(duration: number): string {
  //Metodo floor arredonta para baixo
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const timeString = [hours, minutes, seconds]
  .map(unit => String(unit).padStart(2, '0')) //Pecorrendo os valores e adicionando um 0 a frente caso só tenha um digito
  .join(':');

  return timeString;
}