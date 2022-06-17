import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../../../core/services/account.service";
import {User} from "../../../../core/models/user";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

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
}
