import { Component, ElementRef, ViewChild, Input, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CollectionService } from '../../../services/collection.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  @Input() map: any = {};
  @Input() parentCollection: any;
  @Input() siblings: any[];

  filteredSiblings: any[] = [];

  loading: boolean = true;
  pagePid: string = '';
  manifestLink: string = '';
  nextArrowActive: boolean = false;
  prevArrowActive: boolean = false;
  nextMap: any = {};
  prevMap: any = {};
  acutalIndex: number = 0;

  @ViewChild('infoDiv', { static: false }) infoDiv!: ElementRef; // Reference na app-part-info
  @ViewChild('mapDiv', { static: false }) mapDiv!: ElementRef; // Reference na app-part-map
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  showMoreInfo = false; // Stav tlačítka

  subscription: Subscription = new Subscription();
  apiThumbUrl = 'https://api.kramerius.mzk.cz/search/api/client/v7.0/items/';
  currentLang: string;

  private observer!: IntersectionObserver;

  constructor(private translate: TranslateService,
              private collectionService: CollectionService,
              private router: Router) { }

  ngOnInit(): void {
    // Language change subscription
    const langSub = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
    this.subscription.add(langSub);
    console.log('Map:', this.map, this.parentCollection, this.siblings);
    this.collectionService.getPagesByPid(this.map['pid']).subscribe((data: any) => {
      console.log('Pages:', data['response']['docs'][0]);
      this.pagePid = data['response']['docs'][0]['pid'];
      this.manifestLink = 'https://api.kramerius.mzk.cz/search/iiif/' + this.pagePid + '/info.json';
      console.log(this.manifestLink);
      if (this.siblings.length > 1) {
        this.siblings.find((self, index) => { 
          if (self['pid'] === this.map['pid']) {
            this.acutalIndex = index;
            if (index > 0) {
              this.prevArrowActive = true;
              this.prevMap = this.siblings[index - 1];
            }
            const nextIndex = index + 1;
            if (nextIndex < this.siblings.length) {
              this.nextArrowActive = true;
              this.nextMap = this.siblings[nextIndex];
            }
            if (this.siblings.length > 12) {
              if (index < this.siblings.length - 13) {
                this.filteredSiblings = this.siblings.slice(index + 1, index + 13);
              } else {
                this.filteredSiblings = this.siblings.slice(this.siblings.length - 13, this.siblings.length);
              }
            } else {
              this.filteredSiblings = this.siblings;
            }
          }
        });
      } else {
        console.log('No siblings');
        this.nextArrowActive = false;
        this.prevArrowActive = false;
      }
      this.loading = false;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.infoDiv && this.mapDiv) {
        this.setupObserver();
      } else {
        console.error('Missing ViewChild references for infoDiv or mapDiv');
      }
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
      }
    }, 3000); // Odložení inicializace na další tick
  }

  // Dalsi / predchozi mapa
  onNextMap() {
    console.log('Next map', this.nextMap);
    if (this.nextMap['pid']) {
      this.router.navigate(['/mollova-sbirka', this.nextMap['pid']]);
    }
  }
  onPrevMap() {
    console.log('Previous map');
    if (this.prevMap['pid']) {
      this.router.navigate(['/mollova-sbirka', this.prevMap['pid']]);
    }
  }

  getAuthors(): string {
    if (this.map['authors'] && this.map['authors'].length > 1) {
      return this.translate.instant('authors') + this.map['authors'].join(', ');
    }
    return this.translate.instant('author') + this.map['authors'] || '';
  }
  getPublishersData(): string {
    let pbl = '';
    pbl += this.translate.instant('published');
    if (this.map['publication_places.facet']) {
      pbl += this.map['publication_places.facet'].join(' ;');
    }
    if (this.map['publishers.facet']) {
      if (this.map['publication_places.facet']) {
        pbl += ' : ';
      }
      pbl += this.map['publishers.facet'].join(' ;');
    }
    if (this.map['date.str']) {
      pbl += ', ' + this.map['date.str'];
    }
    return pbl;
  }
  getGeographicNames(): string {
    if (this.map['geographic_names.facet']) {
      return this.translate.instant('geo-names') + this.map['geographic_names.facet'].join(', ');
    }
    return '';
  }
  getNewShelfLocator(): string {
    return this.translate.instant('shelf-locator-new') + this.map['shelf_locators'] || '';
  }

  // Chovani pri skrolovani

  scrollTo(target: 'info' | 'map') {
    const element = target === 'info' ? this.infoDiv.nativeElement : this.mapDiv.nativeElement;
    element.scrollIntoView({ behavior: 'smooth' });
    this.showMoreInfo = target === 'info';
  }
  onScroll(): void {
    const scrollTop = this.scrollContainer.nativeElement.scrollTop;

    if (scrollTop <= 50) {
      this.showMoreInfo = false;
    }
  }
  private setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // console.log('Intersecting:', entry.target);
            this.showMoreInfo = entry.target === this.infoDiv.nativeElement;
          }
        });
      },
      {
        root: null, // Viewport
        threshold: 0.5, // 20% divu musí být viditelné
      }
    );

    // Bezpečně ověříme existenci referencí před přidáním observeru
    if (this.infoDiv?.nativeElement) {
      this.observer.observe(this.infoDiv.nativeElement);
    }
    if (this.mapDiv?.nativeElement) {
      this.observer.observe(this.mapDiv.nativeElement);
    }
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
    // if (item.model === 'collection') {
      return `${this.apiThumbUrl}${item.pid}/image/thumb`;
    // } else {
      // return item['thumbnail'];
    // }
  }

}
