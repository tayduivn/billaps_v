import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DocviewPage } from './docview.page';
import {ComponentsModule} from '../../_components/components.module';

const routes: Routes = [
  {
    path: '',
    component: DocviewPage
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
  declarations: [DocviewPage]
})
export class DocviewPageModule {}
