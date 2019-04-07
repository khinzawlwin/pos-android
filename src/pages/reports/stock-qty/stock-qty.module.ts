import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StockQtyPage } from './stock-qty';

@NgModule({
  declarations: [
    StockQtyPage,
  ],
  imports: [
    IonicPageModule.forChild(StockQtyPage),
  ],
})
export class StockQtyPageModule {}
