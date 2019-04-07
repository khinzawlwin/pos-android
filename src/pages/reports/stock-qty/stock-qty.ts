import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportSerivceProvider } from '../../../providers//report-serivce/report-serivce';

/**
 * Generated class for the StockQtyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stock-qty',
  templateUrl: 'stock-qty.html',
})
export class StockQtyPage {

  public stocks:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public rptSvc: ReportSerivceProvider,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StockQtyPage');
    this.loadStocks();
  }

  loadStocks() {
    this.rptSvc.getAllStocks().subscribe((res:any)=> {
      if(res.stocks) {
        this.stocks = res.stocks;
      }
    });
  }

  closePage(page) {
    this.navCtrl.push(page);
  }

}
