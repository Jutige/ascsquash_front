import {Component, Input, OnInit} from '@angular/core';
import {InfoResult} from "../../../models/info-result.model";
import {identity} from "rxjs";

@Component({
  selector: 'app-info-detail',
  templateUrl: './info-detail.component.html',
  styleUrls: ['./info-detail.component.scss']
})
export class InfoDetailComponent implements OnInit {

  @Input() info: InfoResult;
  @Input() idInfo: bigint;
  constructor() { }

  ngOnInit(): void {
    console.log('idInfo : '+ this.idInfo);
  }

}
