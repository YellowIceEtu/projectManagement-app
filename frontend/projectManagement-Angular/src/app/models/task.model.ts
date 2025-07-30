import { Project } from './project.model';
import { Status } from './status.model';
import { User } from './user.model';

export interface Task {
  id?: number;
  title: string;
  description: string;
  collaborators: User[];
  startDate: string;
  endDate: string;
  creationDate: string;
  status: Status;
  project: Project;
}
