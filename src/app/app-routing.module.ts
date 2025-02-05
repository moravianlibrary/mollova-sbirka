import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './collections/collections.component';
import { SearchComponent } from './search/search.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { OtherComponent } from './other/other.component';

const routes: Routes = [
  // Přesměrování prázdné cesty na 'mollova-sbirka'
  { path: '', redirectTo: 'mollova-sbirka', pathMatch: 'full' },

  // Cesty pro 'mollova-sbirka' a její podcesty
  { path: 'mollova-sbirka', component: CollectionsComponent },
  { path: 'mollova-sbirka/:part', component: CollectionsComponent },
  { path: 'mollova-sbirka/:part/:subpart', component: CollectionsComponent },
  
  // Další cesty
  { path: 'hledat', component: SearchComponent },
  { path: 'o-sbirce', component: AboutComponent },
  { path: 'o-sbirce/:part', component: AboutComponent },
  { path: 'kontakt', component: ContactComponent },
  { path: 'dalsi-sbirky', component: OtherComponent },
  
  // Volitelně: Přesměrování neznámých cest na 'mollova-sbirka'
  { path: '**', redirectTo: 'mollova-sbirka' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
