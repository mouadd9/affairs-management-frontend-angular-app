import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar'
import {MatButton, MatButtonModule} from '@angular/material/button'
import {MatMenuTrigger, MatMenuModule} from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';


import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { ManageAgenciesComponent } from './manage-agencies/manage-agencies.component';
import { ManageAffairsComponent } from './manage-affairs/manage-affairs.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateUserComponent } from './create-user/create-user.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';


import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppHttpInterceptor } from './interceptors/app-http.interceptor';
import { AuthService } from './services/auth.service';
import { AgencyEmployeeTemplateComponent } from './agency-employee-template/agency-employee-template.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminTemplateComponent,
    ManageAgenciesComponent,
    ManageAffairsComponent,
    ManageUsersComponent,
    DashboardComponent,
    LoginComponent,
    CreateUserComponent,
    AgencyEmployeeTemplateComponent
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
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule

  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    },  
    AuthService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
