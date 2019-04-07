import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ReportSerivceProvider } from '../../../providers//report-serivce/report-serivce';
import moment from 'moment';

/**
 * Generated class for the SaleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sale-detail',
  templateUrl: 'sale-detail.html',
})
export class SaleDetailPage {

  public orders:any;
  public orderItems:any;
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
    console.log('ionViewDidLoad SaleDetailPage');
    this.loadSalesDetail();
  }

  loadSalesDetail() {
    this.rptSvc.getSalesDetail(this.query).subscribe((res:any)=> {
      if(res.orders) {
        let order:any;
        this.orders = res.orders;
        this.orderItems = res.orderItems;
        res.orders.map((order, i)=>{
          order.no = i+1;
        });
        this.orders.push(order);
        console.log(this.orderItems);
      }
    });
  }

  onFilter() {
    this.loadSalesDetail();
  }

  closePage(page) {
    this.navCtrl.push(page);
  }

}
