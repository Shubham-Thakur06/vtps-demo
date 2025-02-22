import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GamesComponent } from './components/dashboard/games/games.component';
import { PlayersComponent } from './components/dashboard/players/players.component';
import { PaymentsComponent } from './components/dashboard/payments/payments.component';
import { ManagersComponent } from './components/dashboard/managers/managers.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'games', pathMatch: 'full' },
      { path: 'games', component: GamesComponent },
      { path: 'players', component: PlayersComponent },
      { path: 'payments', component: PaymentsComponent },
      { 
        path: 'managers', 
        component: ManagersComponent,
        canActivate: [AdminGuard]
      }
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
