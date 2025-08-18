import { Component, OnInit, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  EventApi,
  CalendarOptions,
  EventInput,
  DateSelectArg,
  EventClickArg,
} from '@fullcalendar/core/index.js';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Task } from '../../models/task.model';
import { TaskService } from '../../task/task.service';
import { CommonModule, NgFor } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDetailsDialogComponent } from '../../task/task-details-dialog/task-details-dialog.component';
import { options } from '@fullcalendar/core/preact.js';
import { Status } from '../../models/status.model';
import { TaskFormComponent } from '../../task/task-form/task-form.component';
import { Project } from '../../models/project.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calendar-view',
  imports: [FullCalendarModule, CommonModule, MatDialogModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.css',
})
export class CalendarViewComponent implements OnInit {
  tasksList: any[] = [];

  calendarVisible = signal(true);
  currentEvents = signal<EventApi[]>([]);
  project!: Project;

  PROJECT_COLORS = [
    '#F87171', // rouge
    '#60A5FA', // bleu
    '#34D399', // vert
    '#FBBF24', // jaune
    '#A78BFA', // violet
  ];

  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    events: [], // Vide au départ, on va l'alimenter dynamiquement
    weekends: true,
    height: 900,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  });

  projectId: string = '';

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.taskService.fetchTask();

    this.projectId = this.route.snapshot.paramMap.get('projectId')!;

    // Et ici, tu observes les valeurs mises à jour
    this.taskService.tasks$.subscribe((tasks: Task[]) => {
      const events = tasks.map((task) => ({
        // id: String(task.id),
        title: task.title,
        start: task.startDate,
        end: task.endDate,
        collaborators: task.collaborators,

        backgroundColor: task.project
          ? this.getColors(task.project.id ?? 0)
          : '#9ca3af',
        extendedProps: {
          fullTask: task, // stocke toute la tâche ici
        },
      }));

      this.calendarOptions.update((opts) => ({
        ...opts,
        events,
      }));
    });
  }

  mapTasksToEvents(tasks: Task[]): EventInput[] {
    return tasks.map((task) => ({
      // id: task.id?.toString(),
      title: task.title,
      start: task.startDate,
      end: task.endDate, // facultatif, si tu as une date de fin
      allDay: true, // ou false si tu veux les afficher avec heure
      extendedProps: {
        description: task.description,
        collaborators: task.collaborators,
      },
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const startDate = selectInfo.startStr;
    const endDate = selectInfo.endStr;

    const newTask: Task = {
      title: '',
      description: '',
      startDate: startDate,
      endDate: endDate,
      creationDate: new Date().toISOString().split('T')[0], // formater ici
      status: Status.EN_COURS,
      collaborators: [],
      project: {} as Project,
    };

    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: {
        task: newTask,
        mode: 'create',
      },
    });

    dialogRef.componentInstance.formSubmit.subscribe((createdTask: Task) => {
      const taskProjectId = String(createdTask.project.id);
      console.log('iiaojdioajad ', createdTask.project.id);
      this.taskService.addTask(createdTask, taskProjectId).subscribe({
        next: () => {
          dialogRef.close();
          this.taskService.fetchTask(); // recharge les tâches
        },
      });
    });

    dialogRef.componentInstance.cancel.subscribe(() => {
      dialogRef.close();
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    const task: Task = clickInfo.event.extendedProps['fullTask']; // récupération directe

    this.dialog.open(TaskDetailsDialogComponent, {
      data: task,
      width: '800px',
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
  }

  getColors(projectId: number): string {
    const indexColor = projectId % this.PROJECT_COLORS.length;
    return this.PROJECT_COLORS[indexColor];
  }
}
