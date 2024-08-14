import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

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

      // on submit we will store the last "myForm.value" instance (with lates values typed)
      const formData = this.myForm.value;

      // here we will send this.myForm.value (object) to our user service and then expect a response
      // we act as an observer by subscribing to this obervable 
      this.auth.login(formData).subscribe({
        next: (response) => {

          // if the user authenticated this should pass the token to the method that will parse it 
          //console.log('Login successful, token:', response['access-token']);

          this.auth.loadProfile(response); // this loads the profile (decodes the jwt and extracts the claims) and the claims will be stored in the service
       
          this.auth.redirectUserBasedOnRole();
         
        },
        error: (error) => {
          console.error('Login failed:', error);
        },
        complete: () => {
          console.log('Login request completed.');
        }
      });

    }
  }



}
