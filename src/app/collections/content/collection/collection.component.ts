import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { EnvironmentService } from '../../../services/environment.service';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrl: './collection.component.scss',
})
export class CollectionComponent {
    @Input() collection: any = {};
    @Input() children: any[] = [];
    subscription: Subscription = new Subscription();

    apiThumbUrl =
        this.envService.get('krameriusBaseUrl') + '/api/client/v7.0/items/';
    currentLang: string;

    constructor(
        private envService: EnvironmentService,
        private router: Router,
        private translate: TranslateService,
    ) {
        this.currentLang = this.translate.currentLang;
    }

    ngOnInit(): void {
        // Language change subscription
        const langSub = this.translate.onLangChange.subscribe((event) => {
            this.currentLang = event.lang;
        });
        this.subscription.add(langSub);
    }

    onCardClick(item: any): void {
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
            let decs_eng = this.collection['collection.desc_eng']?.length
                ? this.collection['collection.desc_eng'][
                      this.collection['collection.desc_eng'].length - 1
                  ]
                : '';
            return decs_eng;
        } else if (this.currentLang === 'de') {
            let decs_ger = this.collection['collection.desc_ger']?.length
                ? this.collection['collection.desc_ger'][
                      this.collection['collection.desc_ger'].length - 1
                  ]
                : '';
            return decs_ger;
        } else if (this.currentLang === 'cs') {
            let desc_cze = this.collection['collection.desc_cze']?.length
                ? this.collection['collection.desc_cze'][
                      this.collection['collection.desc_cze'].length - 1
                  ]
                : '';
            return desc_cze;
        }
        let desc_cze = this.collection['collection.desc_cze']?.length
            ? this.collection['collection.desc_cze'][
                  this.collection['collection.desc_cze'].length - 1
              ]
            : '';

        return desc_cze;
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
            if (item['part.name']) {
                return item['part.name'];
            }
            return item['title.search'] || item['title'];
        }
    }
    getChildrenDescription(item: any): any {
        if (item.model === 'collection') {
            if (this.currentLang === 'en') {
                let desc_eng = item.collectionDetails['collection.desc_eng']
                    ?.length
                    ? item.collectionDetails['collection.desc_eng'][
                          item.collectionDetails['collection.desc_eng'].length -
                              1
                      ]
                    : '';
                return desc_eng;
            } else if (this.currentLang === 'de') {
                let desc_ger = item.collectionDetails['collection.desc_ger']
                    ?.length
                    ? item.collectionDetails['collection.desc_ger'][
                          item.collectionDetails['collection.desc_ger'].length -
                              1
                      ]
                    : '';
                return desc_ger;
            }
            let desc_cze = item.collectionDetails['collection.desc_cze']?.length
                ? item.collectionDetails['collection.desc_cze'][
                      item.collectionDetails['collection.desc_cze'].length - 1
                  ]
                : '';
            return desc_cze;
        } else {
            if (item.authors && item.authors.length > 0) {
                return item['authors'].join(', ');
            } else if (item['date.str']) {
                if (item['date.str'].endsWith(']')) {
                    return item['date.str'].substring(
                        0,
                        item['date.str'].length - 1,
                    );
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
    getOldShelfLocator(shelfLocator: string): string[] {
        let oldSignatures = shelfLocator?.split('|')?.map((s: any) => s.trim());
        let uniqueOldSignatures = Array.from(new Set(oldSignatures));
        return uniqueOldSignatures;
    }
    // https://api.kramerius.mzk.cz/search/api/client/v7.0/items/uuid:a70963b4-753d-401a-ac98-21040ee6508a/image/thumb
}
