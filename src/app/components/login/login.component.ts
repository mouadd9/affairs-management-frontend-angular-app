import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AbstractControlOptions } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  isLogingUser: Boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  hidePassword = true;
  isFirstTimeLogin: boolean = false;

  myForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private userService: UsersService
  ) {
    // we will inject user service here
  }
  ngOnInit(): void {
    // so on init we will build the FormGroup and set values to ''
    // The form values update immediately as the user types

    const formControls = {
      username: ['', Validators.required],
      password: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    };

    const formOptions: AbstractControlOptions = {
      validators: this.passwordMatchValidator
    };

    this.myForm = this.fb.group(formControls, formOptions);

    // Initially disable new password fields
    this.myForm.get('newPassword')?.disable();
    this.myForm.get('confirmPassword')?.disable();
  }

  passwordMatchValidator(control: AbstractControl): {[key: string]: boolean} | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword?.value !== confirmPassword?.value) {
      return { 'mismatch': true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      console.log("1")
      this.isLogingUser = true;
      // on submit we will store the last "myForm.value" instance (with lates values typed)
      const formData = this.myForm.value;

      // this part will only be executed after the "isFirstTimeLogin" is turned to true
      // and after already clicked submit
      if (this.isFirstTimeLogin) {
        // if this is the first time we are logging in
        // Handle password change
        console.log(formData.username);
        this.userService.resetPassword(formData.username ,formData.newPassword).subscribe({
          next: () => {
            this.showSuccess(
              'Password changed successfully. Please log in with your new password.'
            );
            this.isFirstTimeLogin = false;
            
          },
          error: (error) => {
            console.error('Password change failed:', error);
            this.showError('Failed to change password. Please try again.');
          },
          complete: () => {
            this.isLogingUser = false;
          },
        });

 this.showSuccess(
              'Password changed successfully. Please log in with your new password.'
            );
            console.log(formData)
        this.isFirstTimeLogin = false;
       

        console.log("if you reached here then : you entered your credentials , and clicked Sign in, you got the jwt")
        console.log("then instead of getting routed to the employee template you , you were prompt to change you password")
        console.log("what should happen next is : you typying ur new password and submitting it")
        console.log("this will do an api call that will change the password , then it will hide those change password inputs and show the other ones")
      } else {
        console.log("2")
        
        // here we will send this.myForm.value (object) to our user service and then expect a response
        // we act as an observer by subscribing to this obervable
        this.auth.login(formData).subscribe({
          next: (response) => {
            // if the user exists we then parse the token and change the state to athenticated
            // and redirect the user via its role

            console.log('Login successful, token:', response['access-token']); // this will show us the response

            this.auth.loadProfile(response); // this loads the profile (decodes the jwt and extracts the claims) and the claims will be stored in the service
            // loadProfile will also redirect the user to his component based on his role
            if (this.auth.firstTimeAuth) {
              // this will imidiatly switch to the other inputs
              this.isFirstTimeLogin = true;
              this.myForm.get('newPassword')?.enable();
              this.myForm.get('confirmPassword')?.enable();
              this.showSuccess('Please change your password.');
            }
          },
          error: (error) => {
            console.log("3")
            console.error('Login failed:', error);
            this.showError('Incorrect username or password.');
            this.isLogingUser = false;
          },
          complete: () => {
            console.log('Login request completed.');
            this.isLogingUser = false;
          },
        });
      }
    } else {
      this.markAllFieldsAsTouched();
      this.showError('Fill in all fields.');
    }
  }
  markAllFieldsAsTouched() {
    Object.keys(this.myForm.controls).forEach((key) => {
      const control = this.myForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault(); // Prevent the form from submitting
    this.hidePassword = !this.hidePassword;
  }

  // these are used to show success/error messages

  showError(message: string) {
    this.successMessage = '';
    this.errorMessage = message;

    setTimeout(() => (this.errorMessage = ''), 20000);
  }

  showSuccess(message: string) {
    this.errorMessage = '';
    this.successMessage = message;

    setTimeout(() => (this.successMessage = ''), 20000);
  }
}
