import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HomePage } from '../../../pages/home/home';
import { AuthProvider } from '../../../providers/auth/auth';
import { KitchenDisplayPage } from '../../../pages/kitchen-display/kitchen-display';

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  public user:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authSvc: AuthProvider,
  ) {
  }

  ionViewDidLoad() {
    if(this.authSvc.isLoggedIn()) {
      this.user = this.authSvc.user();
      if(this.user.role == 5) {
        this.navCtrl.setRoot(KitchenDisplayPage);
      }
    }
    console.log('ionViewDidLoad ReportPage');
  }

  openPage(page) {
    this.navCtrl.push(page);
  }

  closePage() {
    this.navCtrl.setRoot(HomePage);
  }

}
