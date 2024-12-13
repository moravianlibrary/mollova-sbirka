import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './collection/collection.component';
import { SearchComponent } from './search/search.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  // Přesměrování prázdné cesty na 'mollova-sbirka'
  { path: '', redirectTo: 'mollova-sbirka', pathMatch: 'full' },

  // Cesty pro 'mollova-sbirka' a její podcesty
  { path: 'mollova-sbirka', component: CollectionComponent },
  { path: 'mollova-sbirka/:part', component: CollectionComponent },
  { path: 'mollova-sbirka/:part/:subpart', component: CollectionComponent },
  
  // Další cesty
  { path: 'search', component: SearchComponent },
  { path: 'about', component: AboutComponent },
  
  // Volitelně: Přesměrování neznámých cest na 'mollova-sbirka'
  { path: '**', redirectTo: 'mollova-sbirka' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
