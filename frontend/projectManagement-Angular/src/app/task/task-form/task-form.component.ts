import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { TaskService } from '../task.service';
import { Task } from '../../models/task.model';
import { Status, statusLabels } from '../../models/status.model';
import { ConfirmDialogComponent } from '../../confirmDialogModule/confirm-dialog/confirm-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserService } from '../../users/user.service';
import { User } from '../../models/user.model';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../project/project.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})

//composant enfant
export class TaskFormComponent implements OnInit {
  //servent à transmettre des données d’un composant parent vers un composant enfant.
  @Input() task: Task | null = null;
  @Input() mode: 'create' | 'edit' = 'create';

  //liaison avec le parent dans son html
  @Output() formSubmit = new EventEmitter<Task>();

  @Output() cancel = new EventEmitter<void>();

  userList: User[] = [];

  taskForm: FormGroup;

  getProjectById: Project | null = null;

  //permet de récupérer tous les status sauf celui en retard
  statusLabelsMap = statusLabels;
  statusOptions = Object.values(Status).filter(
    (status) => status !== Status.EN_RETARD
  );

  projectList: Project[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { task: Task; mode: 'create' | 'edit'; fixedProject: Project },
    @Optional() private dialogRef: MatDialogRef<TaskFormComponent>
  ) {
    const today = new Date().toISOString().split('T')[0].replaceAll('-', '/');

    //définit un formulaire réutilisable avec les différentes valeurs et leurs règles de validations
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      startDate: [''],
      endDate: [''],
      creationDate: [today, [Validators.required]],
      collaborators: [],
      description: ['', [Validators.required]],
      status: ['EN_COURS', [Validators.required]],
      project: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAllUser();

    this.projectService.getProjects().subscribe((projects) => {
      this.projectList = projects;
    });

    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    if (projectId) {
      const project = this.projectList.find((p) => p.id === projectId);
      if (project) {
        this.getProjectById = project;
        this.taskForm.patchValue({ project: project.id });
      }
    }

    //remplit le formulaire automatiquement avec les données existantes si il y a une tâche et si l'injection via le MatDialog existe sinon si on est pas dans un MatDialog mais qu'il y a quand même une tâche alors on remplit le formulaire
    if (this.data?.task) {
      this.task = this.data.task;
      this.taskForm.patchValue(this.task);
    } else if (this.task) {
      this.taskForm.patchValue(this.task);
    }

    //récupère les données via  @Inject(MAT_DIALOG_DATA) public data pour définir le mode du formulaire en fonction de la valeur du mode reçu
    if (this.data?.mode) {
      this.mode = this.data.mode;
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const actualDate = new Date().toISOString().split('T')[0];
      console.log('actual date ??? ', actualDate);

      this.taskForm.patchValue({ creationDate: actualDate }); //met à jour la date de création à l'heure actuelle au format YYYY-MM-DD

      //créer une tâche complète
      const formValues = this.taskForm.value;

      // const selectedProject = this.fixedProject
      //   ? this.fixedProject
      //   : this.projectList.find((p) => p.id === formValues.project);

      const selectedProject = this.projectList.find(
        (p) => p.id === formValues.project
      );

      console.log('icicicicici ; ', selectedProject);

      if (!selectedProject) {
        console.error('Projet introuvable');
        return;
      }
      const updatedTask: Task = {
        ...this.task, //récupère l'ancienne tâche (utile le mode édition)
        ...formValues, //écrase avec les nouvelles valeurs dy formulaire

        id: this.task?.id, // attention, pas 0 ici sinon id est forcé
        project: selectedProject,
      };

      this.formSubmit.emit(updatedTask); //émet la tâche au parent via @Output

      //ferme le dialog
      if (this.dialogRef) this.dialogRef.close();
      else this.router.navigate(['/projects', selectedProject.id, 'task']);
    }
  }

  onClose() {
    this.dialog.closeAll();
  }

  onCancel() {
    this.cancel.emit(); // Émet un signal pour annuler
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
