import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-task',
  imports: [TaskFormComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})

//classe parent
export class AddTaskComponent implements OnInit {
  projectId: string = '';
  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;

    console.log('hahahaha ', this.projectId);
  }

  onFormSubmit(newTask: Task) {
    this.taskService.addTask(newTask, this.projectId).subscribe({
      next: () => console.log('Tâche ajoutée : ', newTask),
      error: (err) => console.error(err),
    });
  }
}
