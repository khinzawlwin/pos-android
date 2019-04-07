import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ReportSerivceProvider } from '../../../providers//report-serivce/report-serivce';
import moment from 'moment';

/**
 * Generated class for the SaleQtyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sale-qty',
  templateUrl: 'sale-qty.html',
})
export class SaleQtyPage {

  public saleQty:any;
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
    console.log('ionViewDidLoad SaleQtyPage');
    this.loadSalesQty();
  }

  loadSalesQty() {
    this.rptSvc.getSalesQty(this.query).subscribe((res:any)=> {
      if(res.saleQty) {
        let item:any;
        this.saleQty = res.saleQty;
        res.saleQty.map((item, i)=>{
          item.no = i+1;
        });

        this.saleQty.push(item);
      }
    });
  }

  onFilter() {
    this.loadSalesQty();
  }

  closePage(page) {
    this.navCtrl.push(page);
  }

}
