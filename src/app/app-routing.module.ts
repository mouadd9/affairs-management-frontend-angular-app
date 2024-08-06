import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageAffairsComponent } from './manage-affairs/manage-affairs.component';
import { ManageAgenciesComponent } from './manage-agencies/manage-agencies.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { CreateUserComponent } from './create-user/create-user.component';

const routes: Routes = [
  {path:"dashboard", component:DashboardComponent},
  {path:"agencies", component:ManageAgenciesComponent},
  {path:"users", component:ManageUsersComponent, children: [
    { path: 'create', component: CreateUserComponent }
  ]},
  {path:"affairs", component:ManageAffairsComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/dashboard' } // Fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
