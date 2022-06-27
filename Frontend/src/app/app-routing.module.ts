import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {
  RegisterUserComponent,
  UsersListComponent
} from "./ui/components";
import {LoginComponent} from "./ui/components";
import {AdminGuard} from "./core/guards/admin.guard";

export const appRoutes: Routes = [
  { path: 'login', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', redirectTo: '/admin/users', pathMatch: 'full' },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UsersListComponent },
  { path: 'admin/users', component: UsersListComponent, canActivate: [AdminGuard] },
  { path: 'admin/users/register', component: RegisterUserComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
