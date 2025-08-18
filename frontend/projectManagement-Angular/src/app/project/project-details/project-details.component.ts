import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../project.service';
import { Project } from '../../models/project.model';
import { CommonModule } from '@angular/common';
import { History } from '../../models/history.model';

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

  taskNumber: number = 0;
  taskFinishedNumber: number = 0;
  membersNumber: number = 0;

  projectHistory: History[] = [];

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getProjectById(id);
        this.getAllTasksFromProject(id);
        this.getMembersFromProjectId(id);
        this.getHistory(id);
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

  getAllTasksFromProject(projectId: string) {
    this.projectService.getAllTasksFromProject(projectId).subscribe({
      next: (result) => {
        this.taskNumber = result.length;
        this.taskFinishedNumber = result.filter(
          (task) => task.status == 'TERMINEE'
        ).length;
      },
    });
  }

  getMembersFromProjectId(id: string) {
    this.projectService.getMembersFromProject(id).subscribe({
      next: (result) => {
        this.membersNumber = result.collaborators.length + 1;
      },
      error: (error) => {
        console.error('Erreur:', error);
      },
    });
  }

  getHistory(projectId: string) {
    this.projectService.getHistoryFromProjectId(projectId).subscribe({
      next: (result) => {
        this.projectHistory = result;
        console.log('historique : ', this.projectHistory);
      },
    });
  }

  calculateTime(date: string): string {
    const now = new Date();
    const dateToCaulculate = new Date(date);
    const diffMilliseconds = now.getTime() - dateToCaulculate.getTime();
    const daysDiff = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      return 'Today';
    } else if (daysDiff < 7) {
      return `${daysDiff} days${daysDiff > 1 ? 's' : ''} ago`;
    } else {
      const week = Math.floor(daysDiff / 7);
      return `${week} week${daysDiff > 1 ? 's' : ''} ago`;
    }
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
