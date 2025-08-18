import { CommonModule, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../project/project.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, NgIf, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isVisible: boolean = false;
  firstProjectId: string = '';

  //décorateur Angular pour intéragir directement avec un élément du template HTML (celui qui a la variable #userMenu)
  @ViewChild('userMenu') userMenuRef!: ElementRef;

  constructor(
    private elementRef: ElementRef,
    public authService: AuthService,
    private router: Router,
    private projectService: ProjectService
  ) {}

  onClick() {
    if (this.isVisible == false) this.isVisible = true;
    else this.isVisible = false;
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur(); // retire le focus de l'élément actif
    }
  }

  isLogin(): boolean {
    return this.authService.isAuthenticated();
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  onLogout() {
    console.log('logout');
    this.authService.logout(); // Appele la méthode logout du service
  }

  ngOnInit() {
    this.projectService.fetchProject();
    this.projectService.getProjects().subscribe((projects) => {
      if (projects.length > 0) {
        this.firstProjectId = projects[0].id?.toString() ?? '';
      }
    });
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
