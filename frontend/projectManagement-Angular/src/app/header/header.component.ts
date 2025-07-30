import { CommonModule, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon'

@Component({
  selector: 'app-header',
  imports: [CommonModule, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

isVisible : boolean = false;

//décorateur Angular pour intéragir directement avec un élément du template HTML (celui qui a la variable #userMenu)
 @ViewChild('userMenu') userMenuRef!: ElementRef;

constructor( private elementRef: ElementRef, public authService: AuthService, private router: Router){

}


  onClick(){

    if(this.isVisible == false)
      this.isVisible = true;
    else
    this.isVisible = false
  const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur(); // retire le focus de l'élément actif
      }
  }


    isLogin(): boolean{
    
   return this.authService.isAuthenticated()
  }

  goLogin(){
    this.router.navigate(['/login'])
  }

  onLogout() {
    console.log("logout")
    this.authService.logout();  // Appele la méthode logout du service
  }


  //méthode qui permet d'executer la méthode à chaque clic n'importe où sur la page et passe l'évenement en paramètre
   @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isVisible = false; // Ferme le menu si le clic est à l'extérieur
    }
  }
}
