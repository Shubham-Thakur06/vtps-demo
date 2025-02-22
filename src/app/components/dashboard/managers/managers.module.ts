import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ManagersComponent } from './managers.component';
import { ManagersListComponent } from './managers-list/managers-list.component';
import { ManagerDialogComponent } from './manager-dialog/manager-dialog.component';
import { ManagersService } from '../../../services/managers.service';

@NgModule({
  declarations: [
    ManagersComponent,
    ManagersListComponent,
    ManagerDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild([
      {
        path: '',
        component: ManagersComponent
      }
    ])
  ],
  providers: [
    ManagersService
  ],
  exports: [
    ManagersComponent,
    ManagersListComponent,
    ManagerDialogComponent
  ]
})
export class ManagersModule { } 