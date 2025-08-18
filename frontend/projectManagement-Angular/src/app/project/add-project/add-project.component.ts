import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Project } from '../../models/project.model';
import { ProjectService } from '../project.service';
import { Router } from '@angular/router';
import { Status, statusLabels } from '../../models/status.model';
import { UserService } from '../../users/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-project',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css',
})
export class AddProjectComponent {
  projectForm: FormGroup;

  //permet de récupérer tous les status sauf celui en retard
  statusLabelsMap = statusLabels;
  statusOptions = Object.values(Status).filter(
    (status) => status !== Status.EN_RETARD
  );

  userList: User[] = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private userService: UserService
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startDate: [''],
      endDate: [''],
      creationDate: [''],
      status: ['EN_COURS', [Validators.required]],

      collaborators: [[]],
      task: [[]],
    });
  }

  ngOnInit(): void {
    this.getAllUser();
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const actualDate = new Date().toISOString().split('T')[0];
      console.log('actual date ??? ', actualDate);

      this.projectForm.patchValue({ creationDate: actualDate }); //met à jour la date de création à l'heure actuelle au format YYYY-MM-DD

      //créer une tâche complète
      const formValues = this.projectForm.value;

      this.projectService.addProjectService(formValues).subscribe({
        next: (value) => {
          console.log('ajout project ', value);
          this.router.navigate(['/projects', value.id, 'details']);
        },
        error(err) {
          console.error('Error while trying to add project', err);
        },
      });
    }
  }

  getAllUser() {
    this.userService.getAllUser().subscribe({
      next: (result) => {
        console.log('result ??, : ', result);
        this.userList = result;
      },
    });
  }
}
