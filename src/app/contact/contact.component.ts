import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  faqs: { q: string; a: string; isOpen: boolean }[] = [];

  constructor(private translate: TranslateService) {
    this.faqs = [
      {
        q: this.translate.instant('faq-1'),
        a: this.translate.instant('faq-1-a'),
        isOpen: false
      },
      {
        q: this.translate.instant('faq-2'),
        a: this.translate.instant('faq-2-a'),
        isOpen: false
      },
      {
        q: this.translate.instant('faq-3'),
        a: this.translate.instant('faq-3-a'),
        isOpen: false
      },
      {
        q: this.translate.instant('faq-4'),
        a: this.translate.instant('faq-4-a'),
        isOpen: false
      },
      {
        q: this.translate.instant('faq-5'),
        a: this.translate.instant('faq-5-a'),
        isOpen: false
      },
      {
        q: this.translate.instant('faq-6'),
        a: this.translate.instant('faq-6-a'),
        isOpen: false
      }
    ];
  }

  toggleFaq(index: number): void {
    for (let i = 0; i < this.faqs.length; i++) {
      if (i !== index) {
        this.faqs[i].isOpen = false;
      }
    }
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

}
