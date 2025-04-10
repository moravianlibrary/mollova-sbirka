import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss'
})
export class CollectionComponent {
  @Input() collection: any = {};
  @Input() children: any[] = [];
  subscription: Subscription = new Subscription();


  apiThumbUrl = environment.krameriusBaseUrl + "/api/client/v7.0/items/";
  currentLang: string;

  constructor(private router: Router, private translate: TranslateService
  ) { this.currentLang = this.translate.currentLang; }

  ngOnInit(): void {
    console.log('Collection:', this.collection);
    console.log('Children:', this.children);
    // Language change subscription
    const langSub = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
    this.subscription.add(langSub);
  }

  onCardClick(item: any): void {
    console.log('Card clicked:', item);
    this.router.navigate(['/mollova-sbirka', item.pid]);
  }

  getTitle(): string {
    if (this.currentLang === 'en') {
      return this.collection['title.search_eng'];
    } else if (this.currentLang === 'de') {
      return this.collection['title.search_ger'];
    }
    return this.collection['title.search_cze'];
  }
  getDescription(): string {
    if (this.currentLang === 'en') {
      return this.collection['collection.desc_eng'];
    } else if (this.currentLang === 'de') {
      return this.collection['collection.desc_ger'];
    }
    return this.collection['collection.desc_cze'];
  }
  getChildrenTitle(item: any): any {
    if (item.model === 'collection') {
      if (this.currentLang === 'en') {
        return item.collectionDetails['title.search_eng'];
      } else if (this.currentLang === 'de') {
        return item.collectionDetails['title.search_ger'];
      }
      return item.collectionDetails['title.search_cze'];
    } else {
      return item['title.search'] || item['title'];
    }
  }
  getChildrenDescription(item: any): any {
    if (item.model === 'collection') {
      if (this.currentLang === 'en') {
        return item.collectionDetails['collection.desc_eng'];
      } else if (this.currentLang === 'de') {
        return item.collectionDetails['collection.desc_ger'];
      }
      return item.collectionDetails['collection.desc_cze'];
    } else {
      if (item.authors && item.authors.length > 0) {
        return item['authors'].join(', ');
      } else if (item['date.str']) {
        if (item['date.str'].endsWith(']')) {
          return item['date.str'].substring(0, item['date.str'].length - 1);
        } else {
          return item['date.str'];
        }
      } else {
        return '';
      }
    }
  }
  getChildrenImage(item: any): string {
    if (item.model !== 'manuscript') {
      return `${this.apiThumbUrl}${item.pid}/image/thumb`;
    } else {
      return `${this.apiThumbUrl}${item.thumb_pid[0]}/image/thumb`;
    }
  }
  // https://api.kramerius.mzk.cz/search/api/client/v7.0/items/uuid:a70963b4-753d-401a-ac98-21040ee6508a/image/thumb

}
