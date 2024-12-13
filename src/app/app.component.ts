import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Mollova mapová sbírka';
  constructor(private translate: TranslateService) {
    // Nastavení výchozího jazyka
    this.translate.setDefaultLang('en');

    // Detekce preferovaného jazyka uživatele
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|cs/) ? browserLang : 'en');
  }
}
