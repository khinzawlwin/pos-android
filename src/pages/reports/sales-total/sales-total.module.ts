import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesTotalPage } from './sales-total';

@NgModule({
  declarations: [
    SalesTotalPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesTotalPage),
  ],
})
export class SalesTotalPageModule {}
