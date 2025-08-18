import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';
import { ProjectMembers } from '../models/project-members.model';
import { Task } from '../models/task.model';
import { History } from '../models/history.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrlFromBackend = 'http://localhost:8080/project';
  private apiUrlFromBackendHistory = 'http://localhost:8080/history';

  constructor(private http: HttpClient) {}

  projectsSubject = new BehaviorSubject<Project[]>([]);
  public project$ = this.projectsSubject.asObservable();

  tasksProjectUserSubject = new BehaviorSubject<Task[]>([]);
  public tasksProjectUser$ = this.tasksProjectUserSubject.asObservable();

  private firstProjectId: string = '';

  // projectHistorySubject = new BehaviorSubject<Task[]>([]);
  // public projectHistory$ = this.projectHistorySubject.asObservable();

  private hasFetched = false;

  fetchProject() {
    // if (this.hasFetched) return;
    this.http
      .get<Project[]>(`${this.apiUrlFromBackend}/allProjects`)
      .subscribe({
        next: (project) => {
          this.projectsSubject.next(project);
          this.hasFetched = true;
          if (project.length > 0) {
            this.firstProjectId = project[0].id?.toString() ?? '';
          }
        },
        error: (err) => console.error('Erreur chargement des projets', err),
      });
  }
  getProjects(): Observable<Project[]> {
    return this.project$;
  }
  getFirstProjectId(): string {
    return this.firstProjectId;
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(
      `${this.apiUrlFromBackend}/get-project/${id}`
    );
  }

  fetchTaskByProjectFromUser(projectId: string) {
    this.http
      .get<Task[]>(`${this.apiUrlFromBackend}/${projectId}/get-tasks-project`)
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

  getMembersFromProject(id: string): Observable<ProjectMembers> {
    return this.http.get<ProjectMembers>(
      `${this.apiUrlFromBackend}/${id}/get-members`
    );
  }

  getAllTasksFromProject(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrlFromBackend}/${projectId}/get-all-tasks`
    );
  }

  getHistoryFromProjectId(projectId: string): Observable<History[]> {
    return this.http.get<History[]>(
      `${this.apiUrlFromBackendHistory}/project/${projectId}`
    );
  }

  searchProjectByName(projectName: string): Observable<Project[]> {
    return this.http.get<Project[]>(
      `${this.apiUrlFromBackend}/searchProject?name=${projectName}`
    );
  }

  addProjectService(project: Project): Observable<Project> {
    return this.http.post<Project>(
      `${this.apiUrlFromBackend}/add-project`,
      project
    );
  }
}
