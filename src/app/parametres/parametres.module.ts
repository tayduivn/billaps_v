import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ParametresPage } from './parametres.page';
import {ComponentsModule} from "../_components/components.module";

const routes: Routes = [
  {
    path: '',
    component: ParametresPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
      ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ParametresPage]
})
export class ParametresPageModule {}
