import {Component, Input, OnInit} from '@angular/core';
import {InfoResult} from "../../../models/info-result.model";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Subscription} from "rxjs";
import {InfoService} from "../../../services/info-service";

@Component({
  selector: 'app-info-modify',
  templateUrl: './info-modify.component.html',
  styleUrls: ['./info-modify.component.scss']
})
export class InfoModifyComponent implements OnInit {

  idInfo = '';
  idInfoInt: bigint;
  infoToModify: InfoResult;
  private paramRouteMapSubscription: Subscription;
  private getInfoSubscription: Subscription;

  constructor(private routeInfo: ActivatedRoute,
              private infoService: InfoService) { }

  ngOnInit(): void {

    this.paramRouteMapSubscription = this.routeInfo.paramMap.subscribe((params: ParamMap) => {
        this.idInfo = this.idInfo +params.get('idInfo');
        console.log('idInfo : ', this.idInfo);
        this.idInfoInt = BigInt(this.idInfo);
      }
    );

    this.getInfoSubscription = this.infoService.infoGetSubject.subscribe(
      (info: InfoResult) => {
        this.infoToModify = info;
        console.log('info', info);
      }
    );
    this.infoService.getInfoById(this.idInfoInt);
  }

}
