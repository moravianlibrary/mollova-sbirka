import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrl: './other.component.scss'
})
export class OtherComponent {
  currentLang: string;
  subscription: Subscription = new Subscription();

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang;
  }

  ngOnInit(): void {
    console.log('Other component initialized');
    // Language change subscription
    const langSub = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
    this.subscription.add(langSub);
  }

}
