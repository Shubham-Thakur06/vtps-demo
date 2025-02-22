import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GamesComponent } from './components/dashboard/games/games.component';
import { PlayersComponent } from './components/dashboard/players/players.component';
import { PaymentsComponent } from './components/dashboard/payments/payments.component';
import { CreateGameDialogComponent } from './components/dashboard/games/create-game-dialog/create-game-dialog.component';
import { PlayerSelectionDialogComponent } from './components/dashboard/games/player-selection-dialog/player-selection-dialog.component';
import { PlayerDialogComponent } from './components/dashboard/players/player-dialog/player-dialog.component';
import { PaymentDialogComponent } from './components/dashboard/payments/payment-dialog/payment-dialog.component';
import { GameEditDialogComponent } from './components/dashboard/games/game-edit-dialog/game-edit-dialog.component';
import { ManagersModule } from './components/dashboard/managers/managers.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    GamesComponent,
    PlayersComponent,
    PaymentsComponent,
    CreateGameDialogComponent,
    PlayerSelectionDialogComponent,
    PlayerDialogComponent,
    PaymentDialogComponent,
    GameEditDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ManagersModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
