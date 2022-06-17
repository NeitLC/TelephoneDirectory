import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../../../core/services/account.service";
import {User} from "../../../../core/models/user";
import {UserRoles} from "../../../../core/models/user-roles";

@Component({
  selector: 'app-user-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  public userRoles: string[] = [
    UserRoles.User,
    UserRoles.Admin
  ];

  public adminRole: string = UserRoles.Admin;

  public users: User[] = [];

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.refreshUsers();
  }

  private refreshUsers() {
    this.accountService.getUsers().subscribe(users => {
      this.users = [...users];
    })
  }

  public deleteUser(id: string){
    this.accountService.deleteUser(id).subscribe(
      () => {
        this.users = [...this.users.filter(user => user.id !== id)];
      },
      () => {
        alert("Failed to delete user.")
      });
  }
}
