import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardCounts } from '../../model/DashboardCounts.model';
import { CountUpService } from '../../services/count-up.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  dashboardCounts: DashboardCounts = {
    totalUsers: 0,
    totalAgencies: 0,
    employeeUsers: 0,
    adminUsers: 0,
    backOfficeEmployees: 0
    // we still need 
    ,
    emptyAgencies: 0,
    nonEmptyAgencies: 0
  };

  constructor(private route: ActivatedRoute,
    private countUpService: CountUpService
  ){}

  ngOnInit(): void {
    // here we use our resolver
    this.route.data.subscribe({

     next: data => {
   
      this.dashboardCounts.totalUsers = data['userCounts']['sum'];
      this.dashboardCounts.adminUsers = data['userCounts']['ADMIN'];
      this.dashboardCounts.employeeUsers = data['userCounts']['AGENCY_EMPLOYEE'];
      this.dashboardCounts.backOfficeEmployees = data['userCounts']['BACK_OFFICE'];
      this.dashboardCounts.totalAgencies = data['agencyCount']['total'];
      this.dashboardCounts.emptyAgencies = data['agencyCount']['empty'];
      this.dashboardCounts.nonEmptyAgencies = data['agencyCount']['non_empty'];

       // Trigger the animation after a short delay to ensure all directives are initialized
       setTimeout(() => this.countUpService.triggerAnimation(), 90);

     },

     error: error => console.error('Error fetching user counts:', error)
    
    });
  }
}
