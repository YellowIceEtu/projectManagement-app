import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../project.service';
import { Project } from '../../models/project.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-details',
  imports: [CommonModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css',
})
export class ProjectDetailsComponent implements OnInit {
  constructor(
    public projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  selectedProject: Project | null = null;

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getProjectById(id);
      }
    });
  }

  getProjectById(id: string) {
    this.projectService.getProjectById(id).subscribe({
      next: (result) => {
        // this.projectService.projectIdSignal.set(result);
        this.selectedProject = result;
        console.log('test ?? details ', result);
      },
      error: (error) => {
        console.error('Erreur:', error);
      },
    });
  }
}

// selectedProject: Project | null = null;
// currentProjectId: string | null = null;

// constructor(
//   private route: ActivatedRoute,
//   private projectService: ProjectService
// ) {}

// ngOnInit(): void {
//   this.route.paramMap.subscribe((params) => {
//     const id = params.get('id');
//     if (id && id !== this.currentProjectId) {
//       this.currentProjectId = id;
//       this.loadProject(id);
//     }
//   });
// }

// loadProject(id: string) {
//   this.projectService.getProjectById(id).subscribe((project) => {
//     this.selectedProject = project;
//     // Met à jour le signal si tu l’utilises
//     // this.projectService.projectIdSignal.set(project);
//   });
// }
