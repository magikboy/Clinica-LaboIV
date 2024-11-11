import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TabMenuModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  itemsUnLogged: MenuItem[] | undefined;
  itemsEspecialista: MenuItem[] | undefined;
  itemsPaciente: MenuItem[] | undefined;
  itemsAdmin: MenuItem[] | undefined;

  ngOnInit() {
      const user = this.authService.currentUserSignal();


      this.itemsUnLogged = [
        { label: 'Welcome', icon: 'pi pi-users', routerLink: "/welcome"  },
        { label: 'Login', icon: 'pi pi-sign-in', routerLink: "/login"  },
      ];

      this.itemsPaciente = [
        { label: 'Home', icon: 'pi pi-home', routerLink: "/home" },
        { label: 'Perfil', icon: 'pi pi-user', routerLink: "/mi-perfil" },
        { label: 'Mis Turnos', icon: 'pi pi-list', routerLink: "/mis-turnos"  },
        { label: 'Solicitar Turno', icon: 'pi pi-plus-circle', routerLink: "/solicitar-turno"  },
        { label: 'Salir', icon: 'pi pi-sign-out', command: () => {
          this.authService.logOut();
          this.router.navigateByUrl('/welcome')}  },
      ];

      this.itemsEspecialista = [
        { label: 'Home', icon: 'pi pi-home', routerLink: "/home" },
        { label: 'Perfil', icon: 'pi pi-user', routerLink: "/mi-perfil" },
        { label: 'Mis Turnos', icon: 'pi pi-list', routerLink: "/mis-turnos"  },
        { label: 'Salir', icon: 'pi pi-sign-out', command: () => {
          this.authService.logOut();
          this.router.navigateByUrl('/welcome')}  },
      ];

      this.itemsAdmin = [
        { label: 'Home', icon: 'pi pi-home', routerLink: "/home" },
        { label: 'Perfil', icon: 'pi pi-user', routerLink: "/mi-perfil" },
        { label: 'Usuarios', icon: 'pi pi-users', routerLink: "/users" },
        { label: 'Solicitar Turno', icon: 'pi pi-plus-circle', routerLink: "/solicitar-turno" },
        { label: 'Turnos', icon: 'pi pi-list', routerLink: "/turnos" },
        { label: 'Salir', icon: 'pi pi-sign-out', command: () => {
          this.authService.logOut();
          this.router.navigateByUrl('/welcome')}  },
      ]
  }

  getItems() {
    const user = this.authService.currentUserSignal();
    if(user != null) {
      if(user.role == 'admin')
        return this.itemsAdmin;
      else if (user.role == 'especialista')
        return this.itemsEspecialista;

      return this.itemsPaciente
    }
    return this.itemsUnLogged;
  }
}
