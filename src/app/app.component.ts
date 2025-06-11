import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CollectionService } from './services/collection.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Mollova mapová sbírka';
  constructor(private translate: TranslateService,
              private collectionService: CollectionService
  ) {
    // // Nastavení výchozího jazyka
    // const savedLang = localStorage.getItem('app-language');
    // console.log(`Saved language from localStorage: ${savedLang}`);
    // const defaultLang = savedLang ? savedLang : 'en';
    // this.translate.setDefaultLang(defaultLang);
    // this.translate.use(defaultLang);

    // Detekce preferovaného jazyka uživatele
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|cs/) ? browserLang : 'en');
  }
  ngOnInit(): void {
  const savedLang = localStorage.getItem('app-language');
  console.log(`Saved language from localStorage: ${savedLang}`);
  const defaultLang = savedLang ? savedLang : 'cs';
  this.translate.setDefaultLang(defaultLang);
  this.translate.use(defaultLang);
}
}
