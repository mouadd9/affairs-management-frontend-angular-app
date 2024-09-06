import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageAffairsComponent } from './components/manage-affairs/manage-affairs.component';
import { ManageAgenciesComponent } from './components/manage-agencies/manage-agencies.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { AdminTemplateComponent } from './components/admin-template/admin-template.component';
import { LoginComponent } from './components/login/login.component';
import {  AuthorizationGuard} from './guards/authorization.guard';
import { AgencyEmployeeTemplateComponent } from './components/agency-employee-template/agency-employee-template.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { UsersResolver } from './resolvers/users.resolver';
import { userCountsResolver } from './resolvers/user-counts.resolver';
import { AgencyDataResolver } from './resolvers/agency-counts-resolver.resolver';
import { AgenciesResolver } from './resolvers/agencies.resolver';
import { CreateAgencyComponent } from './components/create-agency/create-agency.component';
import { AffairsResolver } from './resolvers/affairs.resolver';

const routes: Routes = [

  // login , admin are parent roots

  {path:"", redirectTo: "/login", pathMatch : "full"}, // by default the " " path will take us to the Admin component 
  {path:"login", component:LoginComponent},

  {path:"admin", component:AdminTemplateComponent , canActivate : [AuthorizationGuard], data : {roles : ['ADMIN']},
    
    children: [
    
    {path:"users", component:ManageUsersComponent, resolve: { users: UsersResolver , agencies: AgenciesResolver} ,children: [
      { path: 'create', component: CreateUserComponent }
    ]},
    {path:"affairs", component:ManageAffairsComponent, resolve: { affairs: AffairsResolver , agencies: AgenciesResolver}},
    {path:"dashboard", component:DashboardComponent, resolve: {
      userCounts: userCountsResolver,
      agencyCount: AgencyDataResolver
    } },
    {path:"agencies", component:ManageAgenciesComponent, resolve: {agencies: AgenciesResolver}, children:[
      { path: 'create', component: CreateAgencyComponent }
    ] }

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
