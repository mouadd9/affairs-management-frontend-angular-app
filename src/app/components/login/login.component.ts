import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  isLogingUser: Boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  hidePassword = true; 

  myForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { // we will inject user service here 

  }
  ngOnInit(): void {

    // so on init we will build the FormGroup and set values to ''
    // The form values update immediately as the user types

    this.myForm = this.fb.group({
      // each form controle has a key value pair  
      username: ['', Validators.required],
      password: ['', Validators.required]

    });

  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.isLogingUser = true;
      // on submit we will store the last "myForm.value" instance (with lates values typed)
      const formData = this.myForm.value;

      // here we will send this.myForm.value (object) to our user service and then expect a response
      // we act as an observer by subscribing to this obervable 
      
      this.auth.login(formData).subscribe({
        next: (response) => {

          // if the user exists we then parse the token and change the state to athenticated
          // and redirect the user via its role
          
          console.log('Login successful, token:', response['access-token']); // this will show us the response 

          this.auth.loadProfile(response); // this loads the profile (decodes the jwt and extracts the claims) and the claims will be stored in the service
         
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.showError('Incorrect username or password.')
          this.isLogingUser = false;
          
        },
        complete: () => {
          console.log('Login request completed.');
          this.isLogingUser = false;
        }
      });

    } else {
      this.markAllFieldsAsTouched();
      this.showError('Fill in all fields.');
    }
  }
  markAllFieldsAsTouched() {
    Object.keys(this.myForm.controls).forEach(key => {
      const control = this.myForm.get(key);
      control?.markAsTouched();
    });
  }

  

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();  // Prevent the form from submitting
    this.hidePassword = !this.hidePassword;
  }

  // these are used to show success/error messages 

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



}
