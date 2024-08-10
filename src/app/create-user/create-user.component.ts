import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
  myForm!: FormGroup;
  constructor(private fb: FormBuilder){ // we will inject user service here 

  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      // each form controle has a key value pair  
      username: ['', Validators.required],
      email: ['', Validators.required],
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      // here we will send this.myForm.value (json) to our user service and then expect a response
      const formData = this.myForm.value;

    }
  }



}
