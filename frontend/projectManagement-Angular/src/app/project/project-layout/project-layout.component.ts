import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  RouterLink,
  ActivatedRoute,
  RouterOutlet,
  RouterLinkActive,
  NavigationEnd,
  Router,
} from '@angular/router';
import { Project } from '../../models/project.model';
import { ProjectService } from '../project.service';

import { combineLatest, filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-project-layout',
  imports: [CommonModule, RouterLink, NgFor, RouterOutlet, RouterLinkActive],
  templateUrl: './project-layout.component.html',
  styleUrl: './project-layout.component.css',
})
export class ProjectLayoutComponent implements OnInit {
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

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.projectService.getProjectById(id).subscribe((project) => {
          this.selectedProject = project;
        });
      }
    });
  }
}
