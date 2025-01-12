import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ServerDetailsComponent } from './pages/server-details/server-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'servers/:id', component: ServerDetailsComponent },
  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      // Alt route'lar buraya eklenecek
    ]
  }
];
