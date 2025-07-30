import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import {
  RouterLink,
  ActivatedRoute,
  RouterOutlet,
  RouterLinkActive,
} from '@angular/router';
import { Project } from '../../models/project.model';
import { ProjectService } from '../project.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-project-layout',
  imports: [CommonModule, RouterLink, NgFor, RouterOutlet, RouterLinkActive],
  templateUrl: './project-layout.component.html',
  styleUrl: './project-layout.component.css',
})
export class ProjectLayoutComponent {
  projectList: Project[] = [];
  selectedProject: Project | null = null;

  constructor(
    public projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectService.fetchProject();

    this.projectService.getProjects().subscribe((projects) => {
      this.projectList = projects;
    });

    this.route.firstChild?.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('id , ', id);
      if (id) {
        this.projectService.getProjectById(id).subscribe((project) => {
          this.selectedProject = project;
          console.log('Projet récupéré:', project);
        });
      }
    });
  }

  getProjectById(id: string) {
    this.projectService.getProjectById(id).subscribe({
      next: (result) => {
        this.projectService.projectIdSignal.set(result);
        console.log('test ?? ', result);
      },
      error: (error) => {
        console.error('Erreur:', error);
      },
    });
  }
}
