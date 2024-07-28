import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageAffairsComponent } from './manage-affairs/manage-affairs.component';
import { ManageAgenciesComponent } from './manage-agencies/manage-agencies.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

const routes: Routes = [
  {path:"dashboard", component:DashboardComponent},
  {path:"agencies", component:ManageAgenciesComponent},
  {path:"users", component:ManageUsersComponent},
  {path:"affairs", component:ManageAffairsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
