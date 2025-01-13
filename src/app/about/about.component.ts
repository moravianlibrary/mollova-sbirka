import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  activeMenu = 'history';
  currentLang: string = '';

  private subscriptions: Subscription = new Subscription();

  constructor(private translate: TranslateService,
              private route: ActivatedRoute,
              private router: Router
  ) {
    this.currentLang = this.translate.currentLang;
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
    const urlSub = this.route.url.subscribe((url) => {
      console.log('URL:', url);
      if (url.length === 0 || (url.length === 1 && url[0].path === 'o-sbirce')) {
        this.router.navigate(['/o-sbirce']);
        this.activeMenu = 'history';
      } else {
        this.activeMenu = url[1].path;
      }
    });
    this.subscriptions.add(urlSub);
  }

  onMenuClick(item: string) {
    this.activeMenu = item;
    if (item === 'history') {
      this.router.navigate(['/o-sbirce']);
    } else {
      this.router.navigate(['/o-sbirce', item]);    
    }
  }
}
