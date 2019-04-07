import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ReportSerivceProvider } from '../../../providers//report-serivce/report-serivce';
import moment from 'moment';

/**
 * Generated class for the SaleReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sale-report',
  templateUrl: 'sale-report.html',
})
export class SaleReportPage {

  public orders:any;
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
    console.log('ionViewDidLoad SaleReportPage');
    this.loadSalesReport();
  }

  loadSalesReport() {
    this.rptSvc.getSalesReport(this.query).subscribe((res:any)=> {
      if(res.orders) {
        let order:any;
        this.orders = res.orders;
        res.orders.map((order, i)=>{
          order.id = i+1;
        });
        this.orders.push(order);
        console.log(this.orders);
      }
    });
  }

  onFilter() {
    this.loadSalesReport();
  }

  closePage(page) {
    this.navCtrl.push(page);
  }

}
