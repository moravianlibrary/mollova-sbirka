import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { EnvironmentService } from '../services/environment.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentLang: string = '';
  activeLink: string = '';
  menuExpanded = false;

  constructor(private translate: TranslateService, private envService: EnvironmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('app-language') || 'cs';
    console.log('Current language:', this.currentLang);
    this.router.events.subscribe((val) => {
      // console.log('Router:', this.router.url.split('/')[1]);
      if (this.router.url.split('/')[1] !== 'mollova-sbirka') {
        this.activeLink = this.router.url.split('/')[1];
        if (this.activeLink.includes('?')) {
          this.activeLink = this.activeLink.split('?')[0];
        }
      } else {
        this.activeLink = '';
      }
    });
    this.logDevInfo();
  }

  switchLanguage(lang: string): void {
    localStorage.setItem('app-language', lang);
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
    return this.envService.get('devMode');
  }

  getDevInfo(): string {
    return "devMode: " + this.envService.get('devMode') + "; environmentCode: " + this.envService.get('environmentCode') + "; environmentName: " + this.envService.get('environmentName');
  }

  logDevInfo(): void {
    const devInfo = {
      useStaticRuntimeConfig: this.envService.get('useStaticRuntimeConfig'),
      devMode: this.envService.get('devMode'),
      environmentCode: this.envService.get('environmentCode'),
      environmentName: this.envService.get('environmentName'),
      krameriusBaseUrl: this.envService.get('krameriusBaseUrl'),
      elasticBaseUrl: this.envService.get('elasticBaseUrl'),
      googleMapsApiKey: this.envService.get('googleMapsApiKey'),

      gitCommitHash: this.envService.get('git_commit_hash'),
      gitTag: this.envService.get('git_tag'),
      buildDate: this.envService.get('build_date'),
    };
    console.log('Dev Info:', devInfo);
    if (devInfo.gitCommitHash) {
      console.log('https://github.com/trineracz/moll-frontend/commit/' + devInfo.gitCommitHash);
    }
  }

}
