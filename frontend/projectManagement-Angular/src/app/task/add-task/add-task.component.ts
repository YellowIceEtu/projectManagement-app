import { Component } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-add-task',
  imports: [TaskFormComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})

//classe parent
export class AddTaskComponent {

    constructor(private taskService: TaskService) {}

  onFormSubmit(newTask: Task) {
    this.taskService.addTask(newTask).subscribe({
      next: () => console.log('Tâche ajoutée'),
      error: (err) => console.error(err)
    });
  }
}
