import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrlFromBackEnd = 'http://localhost:8080';

  tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  tasksProjectUserSubject = new BehaviorSubject<Task[]>([]);
  public tasksProjectUser$ = this.tasksProjectUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  //METHODE qui récupère les taches sans centraliser les données comme la méthode d'en bas où le service s'abonne directement aux flux de données (Observable) qui va permettre aux autres classes de juste de s'abooner a la propriété task$ qui est le flux de donnée public.

  //  fetchTask(): Observable<Task[]> {
  //     return this.http.get<Task[]>(`${this.apiUrlFromBackEnd}/task/task`).pipe(
  //       tap((tasks) => this.tasksSubject.next(tasks)
  //     )
  //     );
  //   }

  private hasFetched = false;

  //version où les données sont centralisées, les composants doivent juste s'abonner à taskService.getTasks().
  //FetchTask ici, fait un appel http pour charger les données depuis le back end et les stocke dans le taskSubject (BehaviorSubject)
  fetchTask() {
    if (this.hasFetched) return;
    this.http.get<Task[]>(`${this.apiUrlFromBackEnd}/task/task`).subscribe({
      next: (tasks) => {
        this.tasksSubject.next(tasks), (this.hasFetched = true);
      },
      error: (err) => console.error('Erreur chargement des tâches', err),
    });
  }

  //expose le flux observable pour que les composants puissent s'abonner
  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  // fetchTaskByProjectFromUser(projectId: number): Observable<Task[]> {
  //   return this.http.get<Task[]>(
  //     `${this.apiUrlFromBackEnd}/task/${projectId}/get-tasks-project`
  //   );
  // }

  fetchTaskByProjectFromUser(projectId: string) {
    this.http
      .get<Task[]>(
        `${this.apiUrlFromBackEnd}/task/${projectId}/get-tasks-project`
      )
      .subscribe({
        next: (tasks) => {
          this.tasksProjectUserSubject.next(tasks), (this.hasFetched = true);
        },
        error: (err) =>
          console.error('Erreur chargement des tâches du projet', err),
      });
  }

  getTasksProjectUser(): Observable<Task[]> {
    return this.tasksProjectUser$;
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`http://localhost:8080/task/get-task/${id}`);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(
      `${this.apiUrlFromBackEnd}/task/add-task`,
      task
    );
  }

  updateTask(taskUpdate: Task, id: number): Observable<Task> {
    return this.http.put<Task>(
      `${this.apiUrlFromBackEnd}/task/update-task/${id}`,
      taskUpdate
    );
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrlFromBackEnd}/task/delete-task/${taskId}`
    );
  }

  upcomingTask(): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrlFromBackEnd}/task/upcoming-task`
    );
  }
}
