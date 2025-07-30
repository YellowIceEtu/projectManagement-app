import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { RegisterRequest } from './register-request.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:8080/auth'
private tokenKey = 'token';
private refreshTokenKey = 'refreshToken';

  constructor(private http: HttpClient, private router: Router) { }



  //méthode de connexion 
  login(email:string, password: string):Observable<any>{
    return this.http.post<any>(`${this.url}/login`, {email, password}).pipe(
           tap(response => {
            //vérifie que la réponse n'est pas nulle et qu'elle contient un accessToken
        if (response && response.accessToken) {
          this.setTokens(response.accessToken, response.refreshToken)
        } else {
          console.error("Le token n'est pas présent dans la réponse.");
        }
      })
    );
  }

  //méthode d'inscription
  register(data: RegisterRequest):Observable<User>{
    return this.http.post<User>(`${this.url}/register`, data)
  }


  //méthode de déconnexion
  logout() {
  localStorage.removeItem('token');
  this.router.navigate(['/login']); // Redirige après logout
}


  
//méthode qui récupère le refresh token
getRefreshToken(): string | null {
  return localStorage.getItem(this.refreshTokenKey);
}


//méthode qui stocke les token d'accès et refresh token dans localement (localStorage)
setTokens(token: string, refresh: string) {
  localStorage.setItem(this.tokenKey, token);
  localStorage.setItem(this.refreshTokenKey, refresh);
}


//méthode qui permet de stocker des nouveaux tokens d'accès et refresh token. Cette méthode est appelé par l'intercepteur si la requête retourne une erreur 401
refreshToken():Observable<{ accessToken: string, refreshToken: string }> {
  const refreshToken = this.getRefreshToken();
  console.log('Token envoyé pour refresh:', refreshToken);
  return this.http.post<{ accessToken: string, refreshToken: string }>(`${this.url}/refresh-token`, { refreshToken }).pipe(
    tap(response => {
      
      console.log('Réponse du refresh :', response);
      
      this.setTokens(response.accessToken, response.refreshToken);
    })
  );
}


// Récupére le token
getToken(): string | null {
  return localStorage.getItem(this.tokenKey);
}

// Vérifie si l'utilisateur est connecté
isAuthenticated(): boolean {
  return !!this.getToken(); // Vérifie si le token est présent
}
}
