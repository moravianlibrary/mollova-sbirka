import { Component, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  activeMenu = '';
  currentLang: string = '';

  private subscriptions: Subscription = new Subscription();
  menuVisible = false;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(private translate: TranslateService,
              private route: ActivatedRoute,
              private router: Router
  ) {
    this.currentLang = this.translate.currentLang;
  }

  ngOnInit() {
    console.log('AboutComponent ngOnInit', this.activeMenu);
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
    const urlSub = this.route.url.subscribe((url) => {
      console.log('URL:', url);
      if (url.length === 0 || (url.length === 1 && url[0].path === 'o-sbirce')) {
        // this.router.navigate(['/o-sbirce', 'o-sbirce']);
        this.activeMenu = 'o-sbirce';
        this.menuVisible = true;
      } else {
        this.activeMenu = url[1].path;
        this.menuVisible = false;
      }
    });
    this.subscriptions.add(urlSub);
  }

  onMenuClick(item: string) {
    this.activeMenu = item;
    this.menuVisible = false;
    this.router.navigate(['/o-sbirce', item]);
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTo({ top: 0, behavior: 'auto' });
    }
  }
  onBackClick() {
    this.menuVisible = true;
    this.router.navigate(['/o-sbirce']);
  }
}
