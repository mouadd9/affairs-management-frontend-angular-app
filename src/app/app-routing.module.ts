import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageAffairsComponent } from './manage-affairs/manage-affairs.component';
import { ManageAgenciesComponent } from './manage-agencies/manage-agencies.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import {  AuthorizationGuard} from './guards/authorization.guard';
import { AgencyEmployeeTemplateComponent } from './agency-employee-template/agency-employee-template.component';

const routes: Routes = [

  // login , admin are parent roots

  {path:"", redirectTo: "/login", pathMatch : "full"}, // by default the " " path will take us to the Admin component 
  {path:"login", component:LoginComponent},

  {path:"admin", component:AdminTemplateComponent , canActivate : [AuthorizationGuard], data : {roles : ['ADMIN']},
    
    children: [
    
    {path:"users", component:ManageUsersComponent ,  canActivate : [AuthorizationGuard], data : {roles : ['ADMIN']} ,children: [
      { path: 'create', component: CreateUserComponent  ,  canActivate : [AuthorizationGuard], data : {roles : ['ADMIN']} }
    ]},
    {path:"affairs", component:ManageAffairsComponent ,  canActivate : [AuthorizationGuard], data : {roles : ['ADMIN']}},
    {path:"dashboard", component:DashboardComponent ,  canActivate : [AuthorizationGuard], data : {roles : ['ADMIN']}},
    {path:"agencies", component:ManageAgenciesComponent  ,  canActivate : [AuthorizationGuard], data : {roles : ['ADMIN']}}

    ]

  },

  {path:"agencyEmployee" , component:AgencyEmployeeTemplateComponent, canActivate : [AuthorizationGuard], data : {roles : ['AGENCY_EMPLOYEE']}}

 

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
