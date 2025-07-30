import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { TaskService } from './task/task.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MatDialogModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'projectManagement-Angular';

  constructor(public router: Router, public taskService: TaskService) {}

  ngOnInit() {
  this.taskService.fetchTask(); // une seule fois ici
}
}
