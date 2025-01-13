import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentLang: string = '';
  activeLink: string = '';

  constructor(private translate: TranslateService) { 
    this.currentLang = this.translate.currentLang;
   }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }
  changeActiveLink(link: string): void {
    this.activeLink = link;
  }

}
