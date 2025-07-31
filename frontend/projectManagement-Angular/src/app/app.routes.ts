import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CalendarViewComponent } from './calendar/calendar-view/calendar-view.component';
import { TaskFormComponent } from './task/task-form/task-form.component';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { authGuard } from './auth/guard.guard';
import { TaskProjectListComponent } from './task/task-project-list/task-project-list.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { MembersProjectComponent } from './project/members-project/members-project.component';

export const routes: Routes = [
  // {
  //   path: 'task',
  //   loadComponent: () => {
  //     return import('./task/task-list/task-list.component').then(
  //       (m) => m.TaskListComponent
  //     );
  //   },
  //   // canActivate: [authGuard]
  // },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    loadComponent() {
      return import('./calendar/calendar-view/calendar-view.component').then(
        (m) => m.CalendarViewComponent
      );
    },
    canActivate: [authGuard],
  },

  {
    path: 'add-task',
    loadComponent() {
      return import('./task/add-task/add-task.component').then(
        (m) => m.AddTaskComponent
      );
    },
    canActivate: [authGuard],
  },

  {
    path: 'dashboard',
    loadComponent() {
      return import('./dashboard/dashboard-view/dashboard-view.component').then(
        (m) => m.DashboardViewComponent
      );
    },
    canActivate: [authGuard],
  },
  {
    path: 'projects/:id',
    loadComponent() {
      return import('./project/project-layout/project-layout.component').then(
        (m) => m.ProjectLayoutComponent
      );
    },
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'details', pathMatch: 'full' },
      {
        path: 'task',
        component: TaskProjectListComponent,
      },
      {
        path: 'details',
        component: ProjectDetailsComponent,
      },
      {
        path: 'members',
        component: MembersProjectComponent,
      },
    ],
  },
];
