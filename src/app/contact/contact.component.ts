import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
})
export class ContactComponent {
    hoveredIcon: string | null = null;

    faqs: { q: string; a: string; isOpen: boolean }[] = [
        { q: 'faq-1', a: 'faq-1-a', isOpen: false },
        { q: 'faq-2', a: 'faq-2-a', isOpen: false },
        { q: 'faq-3', a: 'faq-3-a', isOpen: false },
        { q: 'faq-4', a: 'faq-4-a', isOpen: false },
        { q: 'faq-5', a: 'faq-5-a', isOpen: false },
        { q: 'faq-6', a: 'faq-6-a', isOpen: false },
    ];

    constructor(private translate: TranslateService) {}

    toggleFaq(index: number): void {
        for (let i = 0; i < this.faqs.length; i++) {
            if (i !== index) {
                this.faqs[i].isOpen = false;
            }
        }
        this.faqs[index].isOpen = !this.faqs[index].isOpen;
    }
    onIconHover(title: string): void {
        this.hoveredIcon = title;
        console.log('Hovered icon:', title);
    }
    onIconLeave(): void {
        this.hoveredIcon = null;
    }
}
