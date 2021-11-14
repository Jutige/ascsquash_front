import {Info} from "./info.model";

export class InfoResult extends Info{
  idInfo: bigint;
  constructor(title: string,
              body: string,
              creationDate: string,
              updateDate: string,
              idUser: string,
              notification: boolean,
              idInfo: bigint) {
    super(title, body, creationDate, updateDate, idUser, notification);
    this.idInfo = idInfo;
  }
}
