import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {componentsList} from "./components-list";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TooltipModule} from "primeng/tooltip";
import {RouterModule} from "@angular/router";
import {TableModule} from "primeng/table"

@NgModule({
  declarations: [
    ...componentsList,
  ],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    DropdownModule,
    TooltipModule,
    RouterModule,
    TableModule,
    FormsModule,
  ],
  exports: [
  ]
})
export class UiModule { }
