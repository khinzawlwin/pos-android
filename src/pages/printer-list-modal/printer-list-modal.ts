import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PrinterListModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-printer-list-modal',
  templateUrl: 'printer-list-modal.html',
})
export class PrinterListModalPage {
  printerList:any=[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private viewCtrl:ViewController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrinterListModalPage');
    this.printerList=this.navParams.get('data');
  }

  select(data)
  {
    this.viewCtrl.dismiss(data);
  }

}
