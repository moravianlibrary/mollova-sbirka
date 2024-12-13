import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ButtonComponent } from './shared/button/button.component';
import { CollectionComponent } from './collection/collection.component';
import { MenuComponent } from './collection/menu/menu.component';


import { ApiService } from './services/api.service';
import { CollectionService } from './services/collection.service';
import { SearchComponent } from './search/search.component';
import { AboutComponent } from './about/about.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ContentComponent } from './collection/content/content.component';

import { MatTooltipModule } from '@angular/material/tooltip';


// Funkce pro vytvoření překladového loaderu
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ButtonComponent,
    CollectionComponent,
    MenuComponent,
    SearchComponent,
    AboutComponent,
    ContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [ApiService, CollectionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
