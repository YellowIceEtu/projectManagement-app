import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, NgFor } from '@angular/common';
import { TaskService } from '../task.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskFormComponent } from '../task-form/task-form.component';

import { MatCardModule} from '@angular/material/card'
import { statusColors, statusLabels } from '../../models/status.model';
import { ConfirmDialogComponent } from '../../confirmDialogModule/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-task-details-dialog',
  imports: [NgFor, CommonModule, ReactiveFormsModule, MatDialogModule, TaskFormComponent, MatCardModule],
  templateUrl: './task-details-dialog.component.html',
  styleUrl: './task-details-dialog.component.css'
})
export class TaskDetailsDialogComponent implements OnInit{
 isEditMode = false;

  // constructor(@Inject(MAT_DIALOG_DATA) public task: Task) {}

  


  constructor(
    @Inject(MAT_DIALOG_DATA) public task: Task,
    public taskService: TaskService, private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    console.log("??? ici : " , this.task.id);
     
  }

    statusLabels = statusLabels;
    statusColors = statusColors;


  // exemple d'update
// onFormSubmit(updatedTask: Task) {
//   if (updatedTask.id !== undefined) {
//     this.taskService.updateTask(updatedTask, updatedTask.id).subscribe({
//       next: () => console.log("Tâche mise à jour"),
//       error: (err: any) => console.error(err)
//     });
//   }
// }


//méthode qui permet de soumettre le formulaire de modification d'une tâche
onFormSubmit(updatedTask: Task) {
  if (updatedTask.id !== undefined) {
    this.taskService.updateTask(updatedTask, updatedTask.id).subscribe({
      next: () => {
        console.log("Tâche mise à jour");
        console.log("ici ; ", this.task)
        this.task = updatedTask; // met à jour la vue
        this.toggleEdit(); // revient à la vue lecture
      },
      error: (err: any) => console.error(err)
    });
  }
}

toggleEdit() {
  this.isEditMode = !this.isEditMode;
} 


//le dialog qui permet d'afficher le message de confirmation dans le composant "ConfirmDialog"
openConfirmDialog(){
  
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '350px',
    data: { message: 'Es-tu sûr de vouloir supprimer cette tâche ?' }
  });

  //après avoir fermé et validé la confirmation, la tâche est supprimé
    dialogRef.afterClosed().subscribe(result => {
    if(result) {
      console.log("result : ", result)
      if(this.task.id){
        this.taskService.deleteTask(this.task.id).subscribe({
    next:()=>{
        console.log("test")
    }
    })
      }
     console.log("-----------")
    }
    else{
      console.log("annulé")
    }
  })
}

onClose(){
  this.dialog.closeAll()
}

deleteTask(){
  let idTest = this.task.id ;
  if(idTest)
  this.taskService.deleteTask(idTest).subscribe({
    next:()=>{
        console.log("test")
    }
    })
}
}
