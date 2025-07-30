export enum Status {

 EN_COURS = "EN_COURS",
 TERMINEE = "TERMINEE",
 A_PRIORISER = "A_PRIORISER",
 EN_RETARD = "EN_RETARD"
    
}


export const statusLabels: { [key in Status]: string } = {
  [Status.A_PRIORISER]: 'À faire',
  [Status.EN_COURS]: 'En cours',
  [Status.TERMINEE]: 'Terminée',
  [Status.EN_RETARD]: 'En retard',
};

export const statusColors: { [key in Status]: string } = {
  [Status.A_PRIORISER]: 'yellow',
  [Status.EN_COURS]: 'blue',
  [Status.TERMINEE]: 'green',
  [Status.EN_RETARD]: 'red'
};