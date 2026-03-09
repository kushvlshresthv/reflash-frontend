import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service'
import { validateUsernameFormat } from '../utils/validators';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private httpClient: HttpClient, private router: Router) {
    console.log("Login component loaded");
  }

  formData = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required, validateUsernameFormat] ,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  username!: FormControl;
  password!: FormControl;

  ngOnInit(): void {
    this.username = this.formData.controls.username;
    this.password = this.formData.controls.password;
  }

  showAllErrors = false;
  onSubmit() {
    if(this.formData.invalid) {
      this.showAllErrors = true;
    }
    const authenticationDetails = `${this.username.value}:${this.password.value}`;
    this.authService.login(authenticationDetails);
    console.log("trying to login");
  }
}
