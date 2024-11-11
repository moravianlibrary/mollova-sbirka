import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './collection/collection.component';

const routes: Routes = [
  { path: '', component: CollectionComponent },
  { path: 'mollova-sbirka', component: CollectionComponent },
  { path: 'mollova-sbirka/:part', component: CollectionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
