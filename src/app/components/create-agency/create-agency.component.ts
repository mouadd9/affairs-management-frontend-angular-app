import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgenciesService } from '../../services/agencies.service';
import { Agency } from '../../model/agency.model';

@Component({
  selector: 'app-create-agency',
  templateUrl: './create-agency.component.html',
  styleUrl: './create-agency.component.css'
})


export class CreateAgencyComponent implements OnInit {
  myForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private agencyService: AgenciesService
    ) {
    // we will inject user service here
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      // each form controle has a key value pair
      agencyCode: ['', Validators.required],
      address: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      // here we will send this.myForm.value (json) to our user service and then expect a response
      const formData = this.myForm.value; // this formData contains the role of the user we want to create
      const agencyToAdd: Agency = {
        agencyCode: formData.agencyCode,
        address: formData.address,
        status: formData.status
      };

      this.agencyService.createAgency(agencyToAdd).subscribe({
        next: (agency) => {
          console.log(agency);
          console.log("agency created");
          this.agencyService.changeState();

        },
        error : (err) =>{
          if (err.message === 'The agency code is taken.') {
            // Handle CONFLICT error specifically
            console.warn('This agency code is already taken.');
            
          } else {
            // Handle other errors
            console.error('Error: ', err.message);
          }
        }
    });

      

      
    }
  }

  goBack() {
    this.agencyService.closeForm();
  }
}
