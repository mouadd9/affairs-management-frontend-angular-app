import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgenciesService } from '../../services/agencies.service';
import { Agency } from '../../model/agency.model';

@Component({
  selector: 'app-create-agency',
  templateUrl: './create-agency.component.html',
  styleUrls: ['./create-agency.component.css']
})
export class CreateAgencyComponent implements OnInit {
  // Form group for agency creation
  myForm!: FormGroup;
  
  // Message variables for displaying errors and success messages
  errorMessage: string = '';
  successMessage: string = '';

  // Flag to indicate if an agency is being created
  isCreatingAgency: boolean = false;

  constructor(
    private fb: FormBuilder,
    private agencyService: AgenciesService
  ) {}

  ngOnInit(): void {
    // Initialize the form with validators
    this.myForm = this.fb.group({
      agencyCode: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      address: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    this.isCreatingAgency = true;
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      const agencyToAdd: Agency = {
        agencyCode: formData.agencyCode,
        address: formData.address,
        status: formData.status
      };

      // Call the service to create the agency
      this.agencyService.createAgency(agencyToAdd).subscribe({
        next: (agency) => {
          console.log("Agency created:", agency);
          this.agencyService.changeState();
          this.showSuccess(`Agency with code: ${agency.agencyCode} created successfully`);
        },
        error: (error: Error) => {
          this.showError(error.message)
        }
      })
      .add(() => {
        // Whether the update succeeds or fails, set isCreatingAgency back to false
        // This hides the loading indicator
        this.isCreatingAgency = false;
      });
    } else {
      this.isCreatingAgency = false;
      this.showError('Please fill all required fields correctly');
    }
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


  // Method to go back (close the form)
  goBack() {
    this.agencyService.closeForm();
  }
}