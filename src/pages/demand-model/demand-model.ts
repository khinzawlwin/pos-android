import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DemandServiceProvider } from '../../providers/demand-service/demand-service';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { HomePage } from '../../pages/home/home';

/**
 * Generated class for the DemandModelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-demand-model',
  templateUrl: 'demand-model.html',
})
export class DemandModelPage {

  public demands: any;
  public setdemand: any = {
    itemid: '',
    demand: '',
    remark: ''
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public demSvc: DemandServiceProvider,
    public cartSvc: CartServiceProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DemandModelPage');
    this.loadDemand();
    this.loadSetDemand();
  }

  loadSetDemand() {
    this.setdemand.itemid = this.navParams.get('itemid');
    this.setdemand.demand = this.navParams.get('demand');
    this.setdemand.remark = this.navParams.get('remark');
  }

  loadDemand() {
    this.demSvc.getAllDemand().subscribe((res:any)=> {
      if(res.demands) {
        this.demands = res.demands;
      }
    });
  }

  closeDemandModal() {
    this.viewCtrl.dismiss();
  }

  getCustDemand(setdemand) {
    this.cartSvc.addDemand(setdemand);
    this.viewCtrl.dismiss();
  }

}
