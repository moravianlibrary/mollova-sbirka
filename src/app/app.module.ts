import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ButtonComponent } from './shared/button/button.component';
import { CollectionsComponent } from './collections/collections.component';
import { MenuComponent } from './collections/menu/menu.component';


import { ApiService } from './services/api.service';
import { CollectionService } from './services/collection.service';
import { SearchComponent } from './search/search.component';
import { AboutComponent } from './about/about.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ContentComponent } from './collections/content/content.component';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CollectionComponent } from './collections/content/collection/collection.component';
import { MapComponent } from './collections/content/map/map.component';
import { IiifImageViewerComponent } from './collections/content/map/iiif-image-viewer/iiif-image-viewer.component';



// Funkce pro vytvoření překladového loaderu
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ButtonComponent,
    CollectionsComponent,
    MenuComponent,
    SearchComponent,
    AboutComponent,
    ContentComponent,
    CollectionComponent,
    MapComponent,
    IiifImageViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
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
