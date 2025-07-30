import { Component, OnInit, signal } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../task.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Status } from '../../models/status.model';
import { computeShrinkWidth } from '@fullcalendar/core/internal';
import { take } from 'rxjs';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  finishTasks: Task[] = [];
  toDoTasks: Task[] = [];
  lateTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  taskByProject: Task[] = [];

  constructor(public taskService: TaskService) {}

  ngOnInit(): void {
    // this.taskService.fetchTask().subscribe(); // charge une seule fois les tâches pour quand c'est pipe (service)

    // this.taskService.tasks$.subscribe({
    //   next: (tasks) => {
    //     this.taskList = tasks;
    //     console.log("iiciic : " ,this.taskService.)
    //   }
    // });

    this.taskService.fetchTask(); // charge les données

    //s'abonne a getTasks pour récupérer toutes les tâches
    this.taskService.getTasks().subscribe((tasks) => {
      //filtre tasks (tableau de tasks) pour récupérer seulement les tâches avec un status A prioriser puis fait un map (pour produire un nouveau tableau avec des champs modifiés) pour formatter la date de création
      this.toDoTasks = tasks
        .filter((task) => task.status === Status.A_PRIORISER)
        .map((task) => ({
          ...task,
          creationDate: this.formatDateToFrench(task.creationDate),
        })); // au lieu de refaire une méthode getToDoTasks comme en dessous

      this.inProgressTasks = tasks
        .filter((task) => task.status == Status.EN_COURS)
        .map((task) => ({
          ...task,
          creationDate: this.formatDateToFrench(task.creationDate),
        }));

      this.lateTasks = tasks
        .filter((task) => task.status == Status.EN_RETARD)
        .map((task) => ({
          ...task,
          creationDate: this.formatDateToFrench(task.creationDate),
        }));

      this.finishTasks = tasks
        .filter((task) => task.status == Status.TERMINEE)
        .map((task) => ({
          ...task,
          creationDate: this.formatDateToFrench(task.creationDate),
        }));
    });
  }

  //fonction qui formate la date en format français DD-MM(en lettres)-YYYY
  formatDateToFrench(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
