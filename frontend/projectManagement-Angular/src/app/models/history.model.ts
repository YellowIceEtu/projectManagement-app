import { Actions } from './actions.model';
import { User } from './user.model';

export interface History {
  id?: number;
  actions: Actions;
  description: string;
  timestamp: string;
  performedBy: User;
  projectName: string;
  projectId: number;
  taskTitle: string;
}
