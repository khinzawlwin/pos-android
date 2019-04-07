import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../../pages/home/home';
import { KitchenDisplayPage } from '../../pages/kitchen-display/kitchen-display';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user:any = {
    phone: '',
    password: ''
  };
  public authUser:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authSvc: AuthProvider,
    public platform: Platform,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onSigninFormSubmit(form){
    
    this.authSvc.login(this.user).subscribe((res:any)=>{
      if(res.user && res.token){
        console.log(res.user);
        console.log(res.token);
        this.authSvc.saveUser(res.user, res.token);
        if(this.authSvc.isLoggedIn()) { 
          this.authUser = this.authSvc.user();
          if(this.authUser.role != 5) {
            this.navCtrl.setRoot(HomePage);
          }else {
            this.navCtrl.setRoot(KitchenDisplayPage);
          }
        }
        
      }
    },
  (res:any)=>{
    
    if(res.error){
      console.log(res.error);
      alert("Invalid Phone and Password");
      // toastr.warning(res.error.message.message);
    }
  });
  }

  numOnly(event:any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  exitApp() {
    this.platform.exitApp();
  }

}
