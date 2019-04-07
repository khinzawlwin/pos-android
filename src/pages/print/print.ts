import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { PrintProvider } from '../../providers/print/print';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { commands } from '../../providers/print/command';
import moment from 'moment';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the PrintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-print',
  templateUrl: 'print.html',
})
export class PrintPage {

  public selectedPrinter:any=[];
  public order: any = {};
  public today:any = moment().format("YYYY-MM-DD");
  public user:any;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private printProvider:PrintProvider,
    private alertCtrl:AlertController,
    private btSerial:BluetoothSerial,
    public modalCtrl: ModalController,
    public cartSvc: CartServiceProvider,
    public authSvc: AuthProvider,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrintPage');
    this.user = this.authSvc.user();
    this.order = this.navParams.get('data');
  }

  listBTDevice()
  {
    this.printProvider.searchBt().then(datalist=>{
      
      //1. Open printer select modal
      let abc= this.modalCtrl.create('PrinterListModalPage',{data:datalist});
      
      //2. Printer selected, save into this.selectedPrinter
      abc.onDidDismiss(data=>{
        this.selectedPrinter=data;

        let xyz=this.alertCtrl.create({
          title: data.name+" selected",
          buttons:['Dismiss']
        });
        xyz.present();

      });
      // alert("success");
      
      //0. Present Modal
      abc.present();

    },err=>{
      alert(err);
      console.log("ERROR",err);
      let mno=this.alertCtrl.create({
        title:"ERROR "+err,
        buttons:['Dismiss']
      });
      mno.present();
    })

  }

  testConnectPrinter()
  {
    var id=this.selectedPrinter.id;
    if(id==null||id==""||id==undefined)
    {
      //nothing happens, you can put an alert here saying no printer selected
    }
    else
    {
      let foo=this.printProvider.connectBT(id).subscribe(data=>{
        console.log("CONNECT SUCCESSFUL",data);
        
        let mno=this.alertCtrl.create({
          title:"Connect successful",
          buttons:['Dismiss']
        });
        mno.present();

      },err=>{
        console.log("Not able to connect",err);
        let mno=this.alertCtrl.create({
          title:"ERROR "+err,
          buttons:['Dismiss']
        });
        mno.present();
      });
    }
  }

  testPrinter()
  {
    var id=this.selectedPrinter.id;
    if(id==null||id==""||id==undefined)
    {
      //nothing happens, you can put an alert here saying no printer selected
      alert("Empty Not Found");
    }
    else
    {
      
      this.voucherPrint(id);
    }
  }

  voucherPrint(address)
  {
    let title = "Voucher";
    let item = this.cartSvc.getItems();

    let printData='';
    printData += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    printData += title.toUpperCase();
    printData += commands.EOL;
    printData += commands.TEXT_FORMAT.TXT_NORMAL;
    printData += commands.HORIZONTAL_LINE.HR_58MM;
    printData += commands.EOL;

    printData += "OrderNo : "+ Number(this.order.voucher_no)+"    Date :  "+ this.today;
    printData += commands.EOL;
    printData += "Table : "+ this.order.table_id+"    SaleBy :"+ this.user.name;
    printData += commands.EOL;
    
    printData += "Item       "+ commands.FEED_CONTROL_SEQUENCES.CTL_HT;;
    printData += commands.FEED_CONTROL_SEQUENCES.CTL_HT;
    printData += "Amount";
    printData += commands.EOL;

    for(var i=0;i<item.length; i++) {
      printData += item[i].name+'- '+item[i].qty+' x '+item[i].price+"    ";
      printData += commands.FEED_CONTROL_SEQUENCES.CTL_HT;
      printData += item[i].qty * item[i].price;
      printData += commands.EOL;
    };

    printData += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    printData += commands.HORIZONTAL_LINE.HR_58MM;
    printData += commands.EOL;
    
    printData += "SubTotal :    ";
    printData += commands.FEED_CONTROL_SEQUENCES.CTL_HT;
    printData += this.cartSvc.getTotalAmount();
    printData += commands.EOL;
    printData += "Discount(%) :   ";
    printData += commands.FEED_CONTROL_SEQUENCES.CTL_HT;
    printData += this.order.discount_amount;
    printData += commands.EOL;
    printData += "Tax(5%) :   ";
    printData += commands.FEED_CONTROL_SEQUENCES.CTL_HT;
    printData += this.order.tax;
    printData += commands.EOL;
    printData += "Total :   ";
    printData += commands.FEED_CONTROL_SEQUENCES.CTL_HT;
    printData += this.order.total_amount;
    printData += commands.EOL;
    printData += "Paid :    ";
    printData += commands.FEED_CONTROL_SEQUENCES.CTL_HT;
    printData += this.order.paid_amount;
    printData += commands.EOL;
    printData += "Change :    ";
    printData += commands.FEED_CONTROL_SEQUENCES.CTL_HT;
    printData += this.order.change_amount;
    printData += commands.EOL;
    printData += "Balance :   ";
    printData += commands.FEED_CONTROL_SEQUENCES.CTL_HT;
    printData += this.order.balance_amount;

    printData += commands.EOL;
    printData += commands.EOL;
    printData += commands.EOL;

    
    let xyz=this.printProvider.connectBT(address).subscribe(data=>{
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
