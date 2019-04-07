import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaleQtyPage } from './sale-qty';

@NgModule({
  declarations: [
    SaleQtyPage,
  ],
  imports: [
    IonicPageModule.forChild(SaleQtyPage),
  ],
})
export class SaleQtyPageModule {}
