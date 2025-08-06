import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../models/project.model';
import { ProjectService } from '../project.service';
import { User } from '../../models/user.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ProjectMembers } from '../../models/project-members.model';

@Component({
  selector: 'app-members-project',
  imports: [CommonModule, NgFor],
  templateUrl: './members-project.component.html',
  styleUrl: './members-project.component.css',
})
export class MembersProjectComponent {
  constructor(
    public projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ownerMember!: any;
  collaboratorsMember!: User[];

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getMembersFromProjectId(id);
      }
    });
  }

  getMembersFromProjectId(id: string) {
    this.projectService.getMembersFromProject(id).subscribe({
      next: (result) => {
        this.ownerMember = result.owner;
        this.collaboratorsMember = result.collaborators;
      },
      error: (error) => {
        console.error('Erreur:', error);
      },
    });
  }
}
