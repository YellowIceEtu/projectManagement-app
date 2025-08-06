import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';
import { ProjectMembers } from '../models/project-members.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrlFromBackend = 'http://localhost:8080/project';
  constructor(private http: HttpClient) {}

  projectsSubject = new BehaviorSubject<Project[]>([]);
  public project$ = this.projectsSubject.asObservable();

  private hasFetched = false;

  fetchProject() {
    if (this.hasFetched) return;
    this.http
      .get<Project[]>(`${this.apiUrlFromBackend}/allProjects`)
      .subscribe({
        next: (project) => {
          this.projectsSubject.next(project), (this.hasFetched = true);
        },
        error: (err) => console.error('Erreur chargement des projets', err),
      });
  }
  getProjects(): Observable<Project[]> {
    return this.project$;
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(
      `${this.apiUrlFromBackend}/get-project/${id}`
    );
  }

  getMembersFromProject(id: string): Observable<ProjectMembers> {
    return this.http.get<ProjectMembers>(
      `${this.apiUrlFromBackend}/${id}/get-members`
    );
  }
}
