import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ButtonComponent } from './shared/button/button.component';
import { CollectionComponent } from './collection/collection.component';
import { MenuComponent } from './collection/menu/menu.component';


import { ApiService } from './services/api.service';
import { CollectionService } from './services/collection.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ButtonComponent,
    CollectionComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ApiService, CollectionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
