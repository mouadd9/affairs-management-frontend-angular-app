import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit, AfterViewInit {


  public users: any[] = [];
  public showAddUserForm: boolean = false;

  // this is a variable of type MatTableDataSource<any> meaning 
  // it will be used to configure data for a mat table
  public dataSource: MatTableDataSource<any>;
  // another way to do this is :
  // public dataSource: any;

  @ViewChild(MatPaginator) paginator! : MatPaginator;
  // we take the paginator declared in our html
  @ViewChild(MatSort) sort! : MatSort;

  // we should declare the displayed column (an array of strings)
  public displayedColumns: string[] = ['id', 'firstName', 'lastName'];

  constructor(private router: Router){
    // here we create a new instance of MatTableDataSource initilized with an empty array 
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
   
    // here we will create some data (ideally here we capture data from the backend )
    for (let i: number = 1; i<100; i++ ){
     this.users.push(
      {
        id: i,
        firstName : Math.random().toString(20),
        lastName : Math.random().toString(20)
      }
     )
    } 
    // this.dataSource = new MatTableDataSource(this.users);
    // we should add it to the datasource  
    // the type of data is set to any 
    this.dataSource.data = this.users; 
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  }

  filterUsers(event: Event): void {
    let value: string = (event.target as HTMLInputElement).value;
    this.dataSource.filter= value;
    
    }

    navigateToAddUser(): void {
      this.router.navigate(['/users/create']); // Navigate to create user route
    }
   

}
