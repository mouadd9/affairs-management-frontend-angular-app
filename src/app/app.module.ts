import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar'
import {MatButton, MatButtonModule} from '@angular/material/button'
import {MatMenuTrigger, MatMenuModule} from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { DashboardComponentComponent } from './dashboard-component/dashboard-component.component';
import { ManageUsersComponentComponent } from './manage-users-component/manage-users-component.component';
import { ManageAffairsComponentComponent } from './manage-affairs-component/manage-affairs-component.component';
import { ManageAgenciesComponentComponent } from './manage-agencies-component/manage-agencies-component.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminTemplateComponent,
    DashboardComponentComponent,
    ManageUsersComponentComponent,
    ManageAffairsComponentComponent,
    ManageAgenciesComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbar,
    MatToolbarModule,
    MatButton,
    MatButtonModule,
    MatMenuTrigger,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule

  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
