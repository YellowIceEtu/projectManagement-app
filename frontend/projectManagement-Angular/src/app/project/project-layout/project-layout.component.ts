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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-project-layout',
  imports: [
    CommonModule,
    RouterLink,
    NgFor,
    RouterOutlet,
    RouterLinkActive,
    ReactiveFormsModule,
  ],
  templateUrl: './project-layout.component.html',
  styleUrl: './project-layout.component.css',
})
export class ProjectLayoutComponent implements OnInit {
  projectList: Project[] = [];
  selectedProject: Project | null = null;
  searchForm: FormGroup;
  searchProjectList: Project[] = [];

  constructor(
    public projectService: ProjectService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

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

  getProjectByName(): void {
    this.projectService
      .searchProjectByName(this.searchForm.value.name)
      .subscribe((result) => {
        this.searchProjectList = result;
        console.log('teiajoajda ', result);
      });
  }

  toggleSearch(): void {
    if (this.searchForm.valid) {
      this.getProjectByName();
    }
  }

  showAllProjects() {
    this.searchProjectList = [];
    this.searchForm.reset();
  }

  redirectAddProject() {
    this.router.navigate(['/add-project']);
  }
}
