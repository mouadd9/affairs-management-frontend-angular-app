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
import {MatRadioModule} from '@angular/material/radio';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';


import { LoginComponent } from './components/login/login.component';
import { AppComponent } from './app.component';
import { AdminTemplateComponent } from './components/admin-template/admin-template.component';
import { ManageAgenciesComponent } from './components/manage-agencies/manage-agencies.component';
import { ManageAffairsComponent } from './components/manage-affairs/manage-affairs.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';


import { AppHttpInterceptor } from './interceptors/app-http.interceptor';
import { AgencyEmployeeTemplateComponent } from './components/agency-employee-template/agency-employee-template.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { CountUpDirective } from './directives/count-up.directive';
import { CreateAgencyComponent } from './components/create-agency/create-agency.component';


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
    AgencyEmployeeTemplateComponent,
    UnauthorizedComponent,
    CountUpDirective,
    CreateAgencyComponent
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
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatTabsModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([AppHttpInterceptor]))

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
