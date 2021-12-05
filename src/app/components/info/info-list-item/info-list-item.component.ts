import {Component, Input, OnInit} from '@angular/core';
import {InfoResult} from "../../../models/info-result.model";
import {UserService} from "../../../services/user-service";
import {Router} from "@angular/router";
import {debounceTime, Subject, Subscription} from "rxjs";
import {InfoService} from "../../../services/info-service";
import {userMsg} from "../../../models/user-msg";

@Component({
  selector: 'app-info-list-item',
  templateUrl: './info-list-item.component.html',
  styleUrls: ['./info-list-item.component.scss']
})
export class InfoListItemComponent implements OnInit {

  @Input() info: InfoResult;
  @Input() idInfo: bigint;

  idInfoString = '';
  displayComment = false;
  dateCreate: Date;
  currentUserType = 0;
  deleteSubscription: Subscription;

  // variables pour l'affichage d'une popup
  successSubject = new Subject<string>();
  successMessage: string = '';
  availableMessage:boolean = false;
  typeMessage = 'success';
  private successSubscription: Subscription;

  infoToPrint = '';

  constructor(private userService: UserService,
              private infoService: InfoService,
              private router: Router) { }

  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();
    this.dateCreate = new Date(this.info.creationDate);
    this.idInfoString = String(this.idInfo);
    this.infoToPrint = this.info.body//.replace(/\n/g, '<br />\n');
  }

  updateInfo(){
    console.log('clic sur update');
    this.router.navigate(['/infos/modify/'+this.idInfoString]);
  }
  deleteInfo(){
    this.deleteSubscription = this.infoService.infoDeleteSubject.subscribe(
      (result: String) => {
        this.emitAlertAndRouting('Suppression effectuée', new userMsg(true, 'Suppression effectuée'));
      }
    );
  }
  emitAlertAndRouting(message: string, response: userMsg) {

    console.log('userMsg ' + response);
    console.log('response.success ' + response.success);
    if (response.success) {
      this.successMessage = message;
      this.typeMessage = 'success';
      this.availableMessage = true;
      this.successSubscription = this.successSubject.pipe(debounceTime(2000)).subscribe(
        () => {
          this.successMessage = '';
          this.availableMessage = false;
          this.router.navigate(['/infos']);
        }
      );
      this.successSubject.next('');
    } else {
      this.successMessage = response.msg;
      this.typeMessage = 'danger';
      this.availableMessage = true;
    }
  }
}
