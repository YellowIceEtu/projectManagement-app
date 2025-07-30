import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
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

  // taskToUdpate: Task ={
  //   "title": '',
  //   "endDate": '',
  //   "startDate": '',
  //   "description": '',
  //   "creationDate": '',
  //   "collaborators": [],

  // } ;

  userList: User[] = [];

  taskForm: FormGroup;

  //permet de récupérer tous les status sauf celui en retard
  statusLabelsMap = statusLabels;
  statusOptions = Object.values(Status).filter(
    (status) => status !== Status.EN_RETARD
  );

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: { task: Task; mode: 'create' | 'edit'; startDate?: string },
    private dialogRef: MatDialogRef<TaskFormComponent>
  ) {
    const today = new Date().toISOString().split('T')[0].replaceAll('-', '/');

    //définit un formulaire réutilisable avec les différentes valeurs et leurs règles de validations
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      startDate: [data.task?.startDate ?? ''],
      endDate: [''],
      creationDate: [today, [Validators.required]],
      collaborators: [],
      description: ['', [Validators.required]],
      status: ['EN_COURS', [Validators.required]],
    });
  }

  ngOnInit(): void {
    //  if (this.mode === 'edit' && this.task) {
    //     this.addTaskForm.patchValue(this.task);
    //   }

    this.getAllUser();

    //remplit le formulaire automatiquement avec les données existantes si il y a une tâche
    if (this.task) {
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
      const updatedTask: Task = {
        ...this.task, //récupère l'ancienne tâche (utile le mode édition)
        ...formValues, //écrase avec les nouvelles valeurs dy formulaire

        id: this.task?.id ?? undefined, // attention, pas 0 ici sinon id est forcé
      };

      this.formSubmit.emit(updatedTask); //émet la tâche au parent via @Output

      //ferme le dialog
      this.dialogRef.close();
    }
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
