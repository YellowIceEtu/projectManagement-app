import { Status } from './status.model';
import { Task } from './task.model';
import { User } from './user.model';

export interface Project {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  creationDate: string;
  status: Status;
  owner: User;
  collaborators: User[];
  task: Task[];
}
