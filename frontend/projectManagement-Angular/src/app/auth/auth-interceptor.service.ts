import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, catchError, throwError, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

//intercepteur HTTP pour ajouter le token dans les requêtes, rafraichir le token si l'acces token est expiré

export function AuthInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);

  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  console.log('Requête envoyée à :', req.url);
  // NE PAS intercepter la requête de refreshToken pour éviter la boucle infinie
  if (
    req.url.endsWith('/auth/refresh-token') ||
    req.url.endsWith('/auth/register') ||
    req.url.endsWith('/auth/login')
  ) {
    return next(req);
  }

  //si le token est présent on clone la requête pour ajouter l'en-tête qui aura la forme "Authorization : Bearer <accesToken>"
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  //envoie la requête modiifié au serveur
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      //si la requête retourne une erreur 401 alors le token est expiré ou invalide
      if (error.status === 401) {
        //on vérifie qu'il y a bien un refresh token dans le localStorage sinon on peut pas refresh et donc on renvoie une erreur
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return throwError(() => error);

        //appelle de la méthode refreshToken pour envoyer une requête au backe end qui nous renvoie des nouveaux tokens
        return authService.refreshToken().pipe(
          switchMap((tokens: any) => {
            localStorage.setItem('token', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);

            //on re-clone la requête avec les nouveaux tokens
            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${tokens.accessToken}`, // ici pas le refreshToken
              },
            });

            return next(newAuthReq);
          }),
          catchError((err) => {
            if (router.url === '/register' || router.url === '/login') {
              return throwError(() => err);
            }
            authService.logout();
            return throwError(() => err);
          })
        );
      }

      return throwError(() => error);
    })
  );
}
