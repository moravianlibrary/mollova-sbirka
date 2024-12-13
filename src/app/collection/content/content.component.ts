import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  @Input() pid!: string | null;
  loading: boolean = false;
  children: any[] = [];
  collection: any = {};
  currentLang: string = '';

  constructor(private collectionService: CollectionService,
              private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentLang = this.translate.currentLang || 'cs';
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });

    this.loading = true;
    this.children = [];
    const contextSub = this.collectionService.context$.subscribe(context => {
      this.pid = context;
      this.loadCollection(context);
    });
    this.subscription.add(contextSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadCollection(pid: string | null): void {
    if (!pid) {
      console.error('No PID provided');
      this.loading = false;
      return;
    }
    this.children = [];
    this.loading = true;
    this.collectionService.getCollection(pid).subscribe((data: any) => {
      if (data && data['response'] && data['response']['docs'] && data['response']['docs'][0]) {
        this.collection = data['response']['docs'][0];
        console.log('Collection:', this.collection);
      } else {
        console.error('Invalid data format:', data);
      }
      this.loading = false;
    });
    this.collectionService.getChildrenByPidWithDetails(pid).subscribe((children) => {
      console.log('Children:', children);
      this.children = children;
      if (children.length === 0) {
        // console.error('No children found for PID:', pid);
        this.collectionService.getCollectionChildren(pid).subscribe((data: any) => {
          if (data && data['response'] && data['response']['docs']) {
            const children = data['response']['docs'];
            console.log('Children:', children);
            this.children = children;
          } else {
            console.error('Invalid data format:', data);
          }
          this.loading = false;
        });
      }
    });
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
}
