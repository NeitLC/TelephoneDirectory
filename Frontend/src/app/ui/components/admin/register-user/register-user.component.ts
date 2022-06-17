import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../core/services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as CustomValidators from "../../../validation/custom-validators";
import {RegisterModel} from "../../../../core/models/register-model";
import {UserRoles} from "../../../../core/models/user-roles";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  public userRoles = [
    UserRoles.User,
    UserRoles.Admin
  ]

  public registerFormGroup: FormGroup = new FormGroup({});
  public submitted: boolean = false;
  public errorMessage: string = "";

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.registerFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required]],
      userRole: ['', Validators.required]
    }, {
      validators: [CustomValidators.match('password', 'confirmPassword')]
    })
  }

  public fieldIsSet(field: string): boolean {
    return this.registerFormGroup.controls[field].errors?.required !== true;
  }

  public emailCorrect(): boolean {
    return this.registerFormGroup.controls['email'].errors?.email !== true;
  }

  public fieldLengthCorrect(field: string): boolean {
    return this.registerFormGroup.controls[field].errors?.minlength === undefined;
  }

  public passwordsMatch(): boolean {
    return this.registerFormGroup.errors?.matching !== true;
  }

  public register() {
    this.submitted = true;
    if (!this.registerFormGroup.valid) {
      return;
    }

    let registerModel: RegisterModel = this.createRegisterModel();
    this.authService.register(registerModel).subscribe(
      () => {},
      () => {
        this.errorMessage = "Failed to register new user.";
      },
    )
  }

  private createRegisterModel(): RegisterModel {
    return new RegisterModel(
      this.registerFormGroup.controls['email'].value,
      this.registerFormGroup.controls['userName'].value,
      this.registerFormGroup.controls['password'].value,
      this.registerFormGroup.controls['confirmPassword'].value,
      this.registerFormGroup.controls['phoneNumber'].value,
      this.registerFormGroup.controls['userRole'].value
    );
  }
}
