import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDTO } from '../../model/user.model';
import { UsersService } from '../../services/users.service';
import { Subscription } from 'rxjs';
import { NgZone } from '@angular/core';
import { Agency } from '../../model/agency.model';
import { AgenciesService } from '../../services/agencies.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-manage-agencies',
  templateUrl: './manage-agencies.component.html',
  styleUrl: './manage-agencies.component.css',
})
export class ManageAgenciesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // Properties for agencies management
  public agencies: Agency[] = []; // Array to store the list of agencies
  public dataSource: MatTableDataSource<Agency>; // DataSource for the agencies table
  displayedColumns: string[] = [
    'id',
    'agencyCode',
    'address',
    'status',
    'creationDate',
    'actions',
  ]; // Columns to be displayed in the agencies table
  public showAddAgencyForm: boolean = false;

  // Properties for employees management
  public showEmpl: boolean = false; // Flag to show/hide employees section
  public employees: UserDTO[] = []; // Array to store the list of employees
  public employeeDataSource: MatTableDataSource<UserDTO>; // DataSource for the employees table
  public employeeDisplayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'username',
    'roles',
    'actions',
  ]; // Columns to be displayed in the employees table
  public currentAgencyCode!: string; // Stores the code of the currently selected agency

  // ViewChild and ViewChildren decorators for accessing DOM elements and Angular Material components
  @ViewChild('agencyPaginator') agencyPaginator!: MatPaginator;
  @ViewChild('agencySort') agencySort!: MatSort;
  @ViewChild('agencyFormOutlet') agencyFormOutlet!: ElementRef;
  @ViewChild('chart') chart!: ElementRef;
  @ViewChild('employees') employeeSection!: ElementRef;
  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sorts!: QueryList<MatSort>;

  // Flags for tracking initialization of employee table components
  private employeePaginatorInitialized = false;
  private employeeSortInitialized = false;

  // Subscription to manage all subscriptions in the component
  private updateSubscription: Subscription = new Subscription();

  // in-line Form-related properties
  editForm: FormGroup | null = null;
  editUserForm: FormGroup | null = null;
  editingAgencyId: any;
  editingUserId: any;

  // Properties for displaying messages
  errorMessage: string = '';
  successMessage: string = '';
  deletionMessage: string = '';
  errorMessage2: string = '';
  successMessage2: string = '';
  deletionMessage2: string = '';

  // Flags for tracking save and delete operations
  isSaving: boolean = false;
  isSavingUser: boolean = false;
 


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private agencyService: AgenciesService,
    private ngZone: NgZone,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    // Initialize the data sources for agencies and employees tables
    this.dataSource = new MatTableDataSource<Agency>([]);
    this.employeeDataSource = new MatTableDataSource<UserDTO>([]);
  }

  ngOnInit(): void {
    // Subscribe to the route data to get the agencies
    this.route.data.subscribe({
      next: (data) => {
        this.agencies = data['agencies']; // Get agencies from the resolver
        this.dataSource.data = this.agencies; // Populate the agencies table
      },
    });

    // Set up subscriptions for real-time updates
    this.setupSubscriptions();
  }

  ngAfterViewInit() {
    // Set up paginator and sort for the agencies table
    this.dataSource.paginator = this.agencyPaginator;
    this.dataSource.sort = this.agencySort;
  }

  ngAfterViewChecked() {
    // Set up paginator and sort for the employees table if it's visible
    if (
      this.showEmpl &&
      !this.employeePaginatorInitialized &&
      this.paginators.length > 1
    ) {
      this.employeeDataSource.paginator = this.paginators.toArray()[1];
      this.employeePaginatorInitialized = true;
      this.cdr.detectChanges();
    }
    if (
      this.showEmpl &&
      !this.employeeSortInitialized &&
      this.sorts.length > 1
    ) {
      this.employeeDataSource.sort = this.sorts.toArray()[1];
      this.employeeSortInitialized = true;
      this.cdr.detectChanges();
    }
  }

  // Method to set up all subscriptions
  private setupSubscriptions(): void {
    // Subscribe to changes in agencies state
    this.updateSubscription.add(
      this.agencyService.changeAgenciesState$.subscribe({
        next: (newAgencies) => {
          this.agencies = newAgencies;
          this.dataSource.data = this.agencies;
        },
        error: (error) => console.error('Error updating agencies:', error),
      })
    );

    // Subscribe to close agency form event
    this.updateSubscription.add(
      this.agencyService.closeAgencyForm$.subscribe(() =>
        this.scrollThenNavigate()
      )
    );
  }

  // Method to filter agencies based on user input
  filterAgencies(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Method to scroll to the agency creation form (naviguation -> scrollIntoView)
  scrollToForm(): void {
    this.router.navigate(['create'], { relativeTo: this.route });
    setTimeout(() => {
      this.agencyFormOutlet.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }, 100);
  }

  // Method to safely retrieve a form control
  // This is used to access form controls in the template and in the component
  getFormControl(fieldName: string): FormControl {
    // Attempt to get the form control from the editForm
    // If editForm is null or undefined, the ?. operator prevents an error
    // If the control doesn't exist, we return a new, empty FormControl
    // This ensures we always return a FormControl, preventing template errors
    return (
      (this.editForm?.get(fieldName) as FormControl) || new FormControl('')
    );
  }

  // Method to initiate the editing process for an agency
  // This is called when the user clicks the edit button for an agency
  editAgency(agency: Agency): void {
    // Set the editingAgencyId to the current agency's id
    // This is used in the template to show/hide edit fields
    this.editingAgencyId = agency.id;

    // Create a new FormGroup with the current agency's data
    // This allows us to edit the agency's data without affecting the original object
    this.editForm = this.fb.group({
      // Each form control is initialized with the current value and required validator
      agencyCode: [agency.agencyCode, [Validators.required, Validators.pattern('^[0-9]+$')]],
      address: [agency.address, Validators.required],
      status: [agency.status, Validators.required],
    });
  }

  // Method to cancel the editing process
  // This is called when the user clicks the cancel button or when editing is complete
  cancelEdit(): void {
    // Reset the editingAgencyId to null
    // This will hide the edit fields in the template
    this.editingAgencyId = null;

    // Reset the editForm to null
    // This clears any changes made during editing
    this.editForm = null;
  }

  // Method to save changes made to an agency
  // This is called when the user clicks the save button after editing
  saveChanges(agency: Agency): void {
    // Check if the editForm exists and is valid
    if (this.editForm && this.editForm?.valid) {
      // Set isSaving to true to show a loading indicator
      this.isSaving = true;

      // Create a new agency object by spreading the original agency
      // and overwriting with the new values from the form
      const updatedAgency: Agency = { ...agency, ...this.editForm.value };

      // Call the updateAgency method from the AgenciesService
      this.agencyService
        .updateAgency(updatedAgency)
        .subscribe({
          next: (response) => {
            // On successful update, assign the response to the original agency object
            // This updates the agency in the component's data
            Object.assign(agency, response);

            this.showSuccess('Agency updated successfully');

            // Cancel the edit mode
            this.cancelEdit();
          },
          error: (error: Error) => {
            // If there's an error, set the error message to display to the user
            
            this.showError(error.message);
          },
        })
        .add(() => {
          // Whether the update succeeds or fails, set isSaving back to false
          // This hides the loading indicator
          this.isSaving = false;
        });
    } else {
      // If the form is invalid, display an error message to the user
     this.showError('Please fill all required fields correctly');
    }
  }

  // Method to delete an agency
  deleteAgency(AgencyId: number): void {
    if (confirm('Are you sure you want to delete this agency?')) {
      this.agencyService
        .deleteAgency(AgencyId)
        .subscribe({
          next: (response) => {
            this.agencyService.changeState();
            this.showSuccess('agency deleted successfully');
          },
          error: (error: Error) => {
            this.showError(error.message);
          },
        });
    }
  }

  // Method to show employees of a specific agency
  // This is called when a user clicks to view employees of an agency
  showEmployees(agencyID: number, agencyCode: string) {
    // Call the service method to get users (employees) by agency ID
    this.usersService
      .getUsersByAgency(agencyID)
      .subscribe({
        next: (employees: UserDTO[]) => {
          // When employees are successfully fetched:

          // Store the fetched employees in the component's employees array
          this.employees = employees;

          // Store the agency code for reference (e.g., displaying in the UI)
          this.currentAgencyCode = agencyCode;

          // Update the employee table's data source with the new employees
          this.employeeDataSource.data = this.employees;

          // Set flag to show the employee section in the template
          this.showEmpl = true;

          // Reset paginator and sort initialization flags
          // This ensures that these will be properly set up when the view updates
          this.employeePaginatorInitialized = false;
          this.employeeSortInitialized = false;

          // Trigger change detection to update the view
          // This is necessary because we're updating view-related properties
          this.cdr.detectChanges();

          // Use setTimeout to scroll to the employee section after a short delay
          // The delay ensures that the view has been updated before scrolling
          setTimeout(() => {
            this.employeeSection.nativeElement.scrollIntoView({
              behavior: 'smooth',
            });
          }, 100);

          this.showSuccess2('Employees fetched successfully');
        },
        error: (error) => {
          // If there's an error fetching employees, log it to the console
          console.error('Error fetching employees:', error);
          this.showError2('Error fetching employees');
          // You might want to add user-facing error handling here
          // For example, setting an error message to display in the template
        },
      });
  }

  // Method to delete a user
  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService
        .deleteUser(userId)
        .subscribe({
          next: () => {
            this.employeeDataSource.data = this.employees.filter(
              (employee) => employee.id != userId
            );
            this.showSuccess2('User deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.showError2('Error deleting user');
          },
        });
    }
  }

  // Method to save changes to a user
  saveUser(user: UserDTO): void {
    if (this.editUserForm && this.editUserForm.valid) {
      this.isSavingUser = true;
      const updatedUser: UserDTO = { ...user, ...this.editUserForm.value };

      this.usersService
        .updateUser(updatedUser)
        .subscribe({
          next: (response) => {
            Object.assign(user, response);
            this.showSuccess2('User updated successfully');
            
            this.cancelUserEdit();
          },
          error: (error: Error) => {
            this.showError2(error.message);
          },
        })
        .add(() => {
          this.isSavingUser = false;
        });
    } else {
      this.showError2('Please fill all required fields correctly');
    }
  }

  // Method to enter edit mode for a user
  editUser(user: UserDTO): void {
    this.editingUserId = user.id;
    this.editUserForm = this.fb.group({
      username: [user.username, [Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$')]],
      email: [user.email, [Validators.required, Validators.email]],
      lastName: [user.lastName, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      firstName: [user.firstName, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]]
    });
  }

  // Method to cancel editing a user
  cancelUserEdit(): void {
    this.editingUserId = null;
    this.editUserForm = null;
  }

  // Method to get a user form control safely
  getUserFormControl(fieldName: string): FormControl {
    return (
      (this.editUserForm?.get(fieldName) as FormControl) || new FormControl('')
    );
  }

  // Method to go back to the agencies list
  goBack() {
    this.chart.nativeElement.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      this.showEmpl = false;
    }, 250);
  }

  // Method to handle navigation after form submission
  private scrollThenNavigate(): void {
    if (this.chart && this.chart.nativeElement) {
      this.smoothScrollToElement(this.chart.nativeElement)
        .then(() => {
          this.ngZone.run(() => this.router.navigateByUrl('/admin/agencies'));
        })
        .catch((error) => {
          console.error('Error during scroll:', error);
          this.router.navigateByUrl('/admin/agencies');
        });
    } else {
      console.warn('Chart element not found, navigating immediately');
      this.router.navigateByUrl('/admin/agencies');
    }
  }

  // Helper method for smooth scrolling
  private smoothScrollToElement(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(resolve, 700);
    });
  }

  showError(message: string) {
    this.successMessage = '';
    this.errorMessage = message;
    
    setTimeout(() => this.errorMessage = '', 7000);
  }

  showSuccess(message: string) {
    this.errorMessage = '';
    this.successMessage = message;
    
    setTimeout(() => this.successMessage = '', 7000);
  }

  showError2(message: string) {
    this.successMessage2 = '';
    this.errorMessage2 = message;
    
    setTimeout(() => this.errorMessage2 = '', 7000);
  }

  showSuccess2(message: string) {
    this.errorMessage2 = '';
    this.successMessage2 = message;
    
    setTimeout(() => this.successMessage2 = '', 7000);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.updateSubscription.unsubscribe();
  }
}
