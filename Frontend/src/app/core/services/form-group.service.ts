import { Injectable } from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FormGroupService {

  constructor() { }

  public getFormGroup(formGroupRoot: AbstractControl, formGroupPath: string): FormGroup {
    return formGroupRoot.get(formGroupPath) as FormGroup;
  }

  public getFormArray(formGroupRoot: AbstractControl, formArrayPath: string): FormArray {
    return formGroupRoot.get(formArrayPath) as FormArray;
  }

  public getFormControl(formGroupRoot: AbstractControl, formControlPath: string): FormControl {
    return formGroupRoot.get(formControlPath) as FormControl;
  }

  public castToFormControl(control: AbstractControl): FormControl {
    return control as FormControl;
  }
}
