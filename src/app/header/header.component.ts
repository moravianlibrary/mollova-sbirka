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
    this.currentLang = this.translate.currentLang;
    this.router.events.subscribe((val) => {
      console.log('Router:', this.router.url.split('/')[1]);
      if (this.router.url.split('/')[1] !== 'mollova-sbirka') {
        this.activeLink = this.router.url.split('/')[1];
      }
    });

    this.printConfig();
  }

  printConfig(): void {
    console.log('environment.useRuntimeConfig:', this.envService.get('useRuntimeConfig'));
    console.log('environment.devMode:', this.envService.get('devMode'));
    console.log('environment.environmentName:', this.envService.get('environmentName'));
    console.log('environment.environmentCode:', this.envService.get('environmentCode'));

    console.log('krameriusBaseUrl:', this.envService.get('krameriusBaseUrl'));
    console.log('elasticBaseUrl:', this.envService.get('elasticBaseUrl'));
    //console.log('elasticLogin:', this.envService.get('elasticLogin') );
    //console.log('elasticPassword:', this.envService.get('elasticPassword') );
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
    return this.envService.get('devMode');
  }

  getDevInfo(): string {

    return "devMode: " + this.envService.get('devMode') + "; environmentCode: " + this.envService.get('environmentCode') + "; environmentName: " + this.envService.get('environmentName');
  }

}
