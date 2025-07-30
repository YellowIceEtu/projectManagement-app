import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../task/task.service';
import { CommonModule, NgFor } from '@angular/common';
import { Status, statusLabels } from '../../models/status.model';

@Component({
  selector: 'app-dashboard-view',
  imports: [CommonModule],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.css'
})
export class DashboardViewComponent implements OnInit{

  constructor(private taskService: TaskService) {}


   taskList: Task[] = [];
   upcomingTaskList: Task[] = [];
   total =0;
  doTotal = 0;
  emergencyTotal = 0;
  finishTotal =0;
  lateTotal = 0;
   ngOnInit(): void {

    this.upcomingTask();


    //permet de s'abonner à un Observable appelé task$ qui est un BehaviorSubject implémenté dans taskService
    this.taskService.tasks$.subscribe((tasks: Task[]) => {

      this.taskList = tasks;


      console.log("total ?? ", this.totalOfTask(tasks));

      this.countStatus(tasks);
      this.total = this.totalOfTask(tasks)
      
    } );


}

totalOfTask(tasks: Task[]){
  return tasks.length;
}


// lateTasks(tasks: Task[]){

// let count = 0;
//  const actualDate = new Date().toISOString().split('T')[0];
//   tasks.forEach(function (item) {
//   if(item.endDate > actualDate && item.status == statusLabels.EN_RETARD
//   ){
//     count = count+1;
//     console.log(" test a voir : ",  count)
//   }
// });
// }


//méthode qui permet de compter le nombre de tâches pour chaque statut d'une tâche
countStatus(tasks: Task[]) {
tasks.forEach(element => {
   switch (element.status) {
      case Status.A_PRIORISER:
        this.emergencyTotal = this.emergencyTotal+1;
        console.log("first ", this.emergencyTotal)
        break;
      case Status.EN_COURS:
        this.doTotal = this.doTotal+1;
        break;
      case Status.TERMINEE:
        this.finishTotal = this.finishTotal+1;
        break;
      case Status.EN_RETARD:
        this.lateTotal = this.lateTotal+1;
        break;
 } ;
});
   
   
  
  }


taskToDoInPriorities(tasks: Task[]){

  let count = 0;
 const actualDate = new Date().toISOString().split('T')[0];
  tasks.forEach(function (item) {
  if(item.endDate <= actualDate ){
    count = count+1;
    console.log(" test a voir : ",  count)
  }
});
}

formatDateToFrench(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}


upcomingTask(){
  this.taskService.upcomingTask().subscribe({
    next:(result) =>{
      
        result.forEach(element => {
          element.startDate = this.formatDateToFrench(element.startDate);

        });
      
      this.upcomingTaskList = result;
      console.log("result ??? ", result)

    }
  })
}
}

  
