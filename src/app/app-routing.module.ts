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
import { UsersResolver } from './resolvers/users.resolver';
import { userCountsResolver } from './resolvers/user-counts.resolver';
import { AgencyDataResolver } from './resolvers/agency-counts-resolver.resolver';

const routes: Routes = [

  // login , admin are parent roots

  {path:"", redirectTo: "/login", pathMatch : "full"}, // by default the " " path will take us to the Admin component 
  {path:"login", component:LoginComponent},

  {path:"admin", component:AdminTemplateComponent , canActivate : [AuthorizationGuard], data : {roles : ['ADMIN']},
    
    children: [
    
    {path:"users", component:ManageUsersComponent, resolve: { users: UsersResolver } ,children: [
      { path: 'create', component: CreateUserComponent }
    ]},
    {path:"affairs", component:ManageAffairsComponent},
    {path:"dashboard", component:DashboardComponent, resolve: {
      userCounts: userCountsResolver,
      agencyCount: AgencyDataResolver
    } },
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
