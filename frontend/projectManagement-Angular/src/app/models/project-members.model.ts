import { User } from './user.model';

export interface ProjectMembers {
  owner: User;
  collaborators: User[];
}
