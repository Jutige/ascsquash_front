import { Component, OnInit } from '@angular/core';
import {UserResult} from "../../../models/user-result.model";
import {debounceTime, Subscription} from "rxjs";
import {InfoResult} from "../../../models/info-result.model";
import {UserService} from "../../../services/user-service";
import {InfoService} from "../../../services/info-service";
import {userMsg} from "../../../models/user-msg";

@Component({
  selector: 'app-info-list',
  templateUrl: './info-list.component.html',
  styleUrls: ['./info-list.component.scss']
})
export class InfoListComponent implements OnInit {

  page: number;
  currentUserType = 0;
  infoListResult: InfoResult[];
  private infoListSubscription: Subscription;
  private errorGetSubscription: Subscription;

  // pour le message d'erreur
  successMessage: string;
  availableMessage = false;
  typeMessage = 'success';

  constructor(private userService: UserService,
              private infoService: InfoService) { }

  ngOnInit(): void {

    this.page = 1;
    this.infoListResult = [];
    this.currentUserType = this.userService.getCurrentRole();
    this.infoListSubscription = this.infoService.infosSubject.subscribe(
      (infos: InfoResult[]) => {
        this.infoListResult = infos;
      }
    );
    this.infoService.getInfosFromServer();
  }

}
