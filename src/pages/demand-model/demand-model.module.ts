import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DemandModelPage } from './demand-model';

@NgModule({
  declarations: [
    DemandModelPage,
  ],
  imports: [
    IonicPageModule.forChild(DemandModelPage),
  ],
})
export class DemandModelPageModule {}
