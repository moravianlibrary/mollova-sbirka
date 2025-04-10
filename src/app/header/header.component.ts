import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentLang: string = '';
  activeLink: string = '';
  menuExpanded = false;

  constructor(private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentLang = this.translate.currentLang;
    this.router.events.subscribe((val) => {
      console.log('Router:', this.router.url.split('/')[1]);
      if (this.router.url.split('/')[1] !== 'mollova-sbirka') {
        this.activeLink = this.router.url.split('/')[1];
      }
    });
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }
  changeActiveLink(link: string): void {
    this.activeLink = link;
  }

  toggleMenu(): void {
    this.menuExpanded = !this.menuExpanded;
  }

  isDevMode(): boolean {
    return environment.devMode;
  }

  getDevInfo(): string {
    return "devMode: " + environment.devMode + "; environmentName: " + environment.environmentName;
  }

}
