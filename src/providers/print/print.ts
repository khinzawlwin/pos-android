import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AlertController} from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/*
  Generated class for the PrintProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PrintProvider {

  constructor(
    public http: HttpClient,
    private btSerial:BluetoothSerial,
    private alertCtrl:AlertController,
  ) {
    console.log('Hello PrintProvider Provider');
  }

  searchBt()
  {
    return this.btSerial.list();
  }

  connectBT(address)
  {
    return this.btSerial.connect(address);

  }

  voucherPrint(address)
  {
    let printData="Test hello this is a test \n\n\n\n Hello Test 123 123 123\n\n\n";

    
    let xyz=this.connectBT(address).subscribe(data=>{
      this.btSerial.write(printData).then(dataz=>{
        console.log("WRITE SUCCESS",dataz);

        let mno=this.alertCtrl.create({
          title:"Print SUCCESS!",
          buttons:['Dismiss']
        });
        mno.present();

        xyz.unsubscribe();
      },errx=>{
        console.log("WRITE FAILED",errx);
        let mno=this.alertCtrl.create({
          title:"ERROR "+errx,
          buttons:['Dismiss']
        });
        mno.present();
      });
      },err=>{
        console.log("CONNECTION ERROR",err);
        let mno=this.alertCtrl.create({
          title:"ERROR "+err,
          buttons:['Dismiss']
        });
        mno.present();
      });

  }

}
