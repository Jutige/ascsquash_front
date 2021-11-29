import {Component, Input, OnInit} from '@angular/core';
import {UserResult} from "../../../models/user-result.model";
import {UserService} from "../../../services/user-service";


@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css']
})
/**
 * classe fille qui permet l'affichage de l'utilisateur sélectionné
 */
export class UserListItemComponent implements OnInit {

  @Input() user:UserResult;
  @Input() idUser: string;

//  roleShow = new Array<string>();
  roleShow = 'Restreint';
  currentUserType = 0;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();

    for (const iterator of this.user.roles) {
      this.roleShow = iterator;
//      this.roleShow.push(iterator + ' ');
    }
  }

}
