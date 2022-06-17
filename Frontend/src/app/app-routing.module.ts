import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {
  RegisterUserComponent,
  UserListComponent,
  UsersListComponent
} from "./ui/components";
import {LoginComponent} from "./ui/components";
import {AdminGuard} from "./core/guards/admin.guard";
import {UserGuard} from "./core/guards/user.guard";

export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', redirectTo: '/admin/users', pathMatch: 'full' },
  { path: 'admin/users', component: UsersListComponent, canActivate: [AdminGuard] },
  { path: 'admin/users/register', component: RegisterUserComponent, canActivate: [AdminGuard] },
  { path: 'user', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent, canActivate: [UserGuard] },
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
