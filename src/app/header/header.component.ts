import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentLang: string = '';
  activeLink: string = '';

  constructor(private translate: TranslateService,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.currentLang = this.translate.currentLang;
    this.router.events.subscribe((val) => {
      console.log('Router:', this.router.url.split('/')[1]);
      this.activeLink = this.router.url.split('/')[1];
    });
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }
  changeActiveLink(link: string): void {
    this.activeLink = link;
  }

}
