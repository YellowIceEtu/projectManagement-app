import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { ProjectService } from '../../project/project.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../models/project.model';
import { CommonModule, NgFor } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskService } from '../task.service';
import { Status, statusColors, statusLabels } from '../../models/status.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';

@Component({
  selector: 'app-task-project-list',
  imports: [CommonModule, NgFor],
  templateUrl: './task-project-list.component.html',
  styleUrl: './task-project-list.component.css',
})
export class TaskProjectListComponent {
  finishTasks: Task[] = [];
  toDoTasks: Task[] = [];
  lateTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  taskByProject: Task[] = [];

  projectIdSignal = signal<string | null>(null);

  statusLabels = statusLabels;
  statusColors = statusColors;

  constructor(
    public projectService: ProjectService,
    private route: ActivatedRoute,
    public taskService: TaskService,
    private dialog: MatDialog
  ) {
    this.route.parent?.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.projectIdSignal.set(id); // met à jour le signal
      }
    });
    effect(() => {
      const id = this.projectIdSignal();
      if (id) {
        this.getProjectById(id);

        // this.taskService.fetchTaskByProjectFromUser(id);
        this.loadTask(id);
      }
    });
  }

  formatDateToFrench(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  getProjectById(id: string) {
    this.projectService.getProjectById(id).subscribe({
      next: (result) => {
        // this.projectService.projectIdSignal.set(result);
        console.log('test ?? ', result);
      },
      error: (error) => {
        console.error('Erreur:', error);
      },
    });
  }

  loadTask(id: string) {
    this.taskService.fetchTaskByProjectFromUser(id); // charge les données

    //s'abonne a getTasks pour récupérer toutes les tâches
    this.taskService.getTasksProjectUser().subscribe((tasks) => {
      // Utilise un map (pour produire un nouveau tableau avec des champs modifiés) sur toutes les tâches du projet pour formatter la date de création
      this.taskByProject = tasks.map((task) => ({
        ...task,
        creationDate: this.formatDateToFrench(task.creationDate),
      }));
    });
  }

  updateTaskFromProjectaskList(taskId?: number) {
    if (typeof taskId !== 'number') {
      console.warn('taskId invalide :', taskId);
      return;
    }
    this.taskService.getTaskById(taskId.toString()).subscribe({
      next: (result) => {
        this.dialog.open(TaskDetailsDialogComponent, {
          data: result,
          width: '800px',
        });
      },
    });
  }
}
