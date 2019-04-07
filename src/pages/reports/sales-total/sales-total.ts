import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ReportSerivceProvider } from '../../../providers//report-serivce/report-serivce';
import moment from 'moment';

/**
 * Generated class for the SalesTotalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sales-total',
  templateUrl: 'sales-total.html',
})
export class SalesTotalPage {
  
  public salesTotal:any;
  public query:any = {
    start_date: moment().format("YYYY-MM-DDTHH:mm:ss"),
    end_date: moment().format("YYYY-MM-DDTHH:mm:ss"),
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public rptSvc: ReportSerivceProvider,
    public viewCtrl: ViewController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SalesTotalPage');
    this.loadSalesTotal();
  }

  loadSalesTotal() {
    this.rptSvc.getSalesTotal(this.query).subscribe((res:any)=> {
      if(res.ordersTotal) {
        this.salesTotal = res.ordersTotal;
        console.log(this.salesTotal);
      }
    });
  }

  onFilter() {
    console.log(this.query);
    this.loadSalesTotal();
  }

  closePage(page) {
    this.navCtrl.push(page);
  }

}
