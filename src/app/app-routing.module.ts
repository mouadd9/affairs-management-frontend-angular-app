import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageAffairsComponent } from './manage-affairs/manage-affairs.component';
import { ManageAgenciesComponent } from './manage-agencies/manage-agencies.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { LoginComponent } from './login/login.component';
import {  AuthorizationGuard} from './guards/authorization.guard';
import { AgencyEmployeeTemplateComponent } from './agency-employee-template/agency-employee-template.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

const routes: Routes = [

  // login , admin are parent roots

  {path:"", redirectTo: "/login", pathMatch : "full"}, // by default the " " path will take us to the Admin component 
  {path:"login", component:LoginComponent},

  {path:"admin", component:AdminTemplateComponent , canActivate : [AuthorizationGuard], data : {roles : ['ADMIN']},
    
    children: [
    
    {path:"users", component:ManageUsersComponent ,children: [
      { path: 'create', component: CreateUserComponent }
    ]},
    {path:"affairs", component:ManageAffairsComponent},
    {path:"dashboard", component:DashboardComponent },
    {path:"agencies", component:ManageAgenciesComponent}

    ]

  },

  {path:"agencyEmployee" , component:AgencyEmployeeTemplateComponent, canActivate : [AuthorizationGuard], data : {roles : ['AGENCY_EMPLOYEE']}},
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '/login' } // This should be the last route

 

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
