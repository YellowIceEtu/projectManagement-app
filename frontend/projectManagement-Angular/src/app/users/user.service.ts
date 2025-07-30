import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlBackEnd = 'http://localhost:8080'
  constructor(private http: HttpClient) { }


  getAllUser():Observable<User[]>{

    return this.http.get<User[]>(`${this.urlBackEnd}/auth/collaborators`);
  }
}
