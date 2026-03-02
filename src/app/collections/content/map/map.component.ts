import { Component, ElementRef, ViewChild, Input, AfterViewInit, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CollectionService } from '../../../services/collection.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EnvironmentService } from '../../../services/environment.service';
import { HttpRequestCache } from '../../../services/http-request-cache.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() map: any = {};
  @Input() parentCollection: any;
  @Input() siblings: any[];

  filteredSiblings: any[] = [];

  loading: boolean = true;
  pagePid: string = '';
  manifestLink: string = '';
  nextArrowActive: boolean = false;
  nextArrowHover: boolean = false;
  prevArrowActive: boolean = false;
  prevArrowHover: boolean = false;
  nextMap: any = {};
  prevMap: any = {};
  acutalIndex: number = 0;
  pages: any[] = [];

  @ViewChild('infoDiv', { static: false }) infoDiv!: ElementRef; // Reference na app-part-info
  @ViewChild('mapDiv', { static: false }) mapDiv!: ElementRef; // Reference na app-part-map
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  showMoreInfo = false; // Stav tlačítka

  subscription: Subscription = new Subscription();
  apiThumbUrl = this.envService.get('krameriusBaseUrl') + "/api/client/v7.0/items/";
  currentLang: string;

  private observer!: IntersectionObserver;

  constructor(
    private envService: EnvironmentService,
    private translate: TranslateService,
    private collectionService: CollectionService,
    private router: Router,
    private httpRequestCache: HttpRequestCache) { }

  ngOnInit(): void {
    // Language change subscription
    const langSub = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
    this.subscription.add(langSub);

    // console.log('Map:', this.map, this.parentCollection, this.siblings);
    this.collectionService.getPagesByPid(this.map['pid']).subscribe((data: any) => {
      // console.log('Pages:', data['response']['docs']);
      this.pages = data['response']['docs'];
      this.pagePid = data['response']['docs'][0]['pid'];
      this.manifestLink = this.envService.get('krameriusBaseUrl') + "/iiif/" + this.pagePid + '/info.json';
      // console.log("Manifest link", this.manifestLink);
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
    console.log('Previous map', this.prevMap);
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
    return this.translate.instant('new_signature') + ': ' + this.map['shelf_locators'] || '';
  }
  getOldShelfLocator(): string {
    if (this.map['elasticDetails'] && this.map['elasticDetails']['signatura_old']) {
        let oldSignatures = this.map['elasticDetails']['signatura_old']?.split('|')?.map((s: any) => s.trim());
        let uniqueOldSignatures = Array.from(new Set(oldSignatures));
        console.log('Old signatures:', oldSignatures);
      return this.translate.instant('old_signature') + ': ' + uniqueOldSignatures;
    } else {
      return this.translate.instant('old_signature') + ': ' + this.map['signatura_old'] || '';
    }

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
  getParentTitle(): string {
    if (this.currentLang === 'en') {
      return this.parentCollection['title.search_eng'];
    } else if (this.currentLang === 'de') {
      return this.parentCollection['title.search_ger'];
    }
    return this.parentCollection['title.search_cze'];
  }

  onPrevArrowHover(): void {
    this.prevArrowHover = true;
  }
  onPrevArrowLeave(): void {
    this.prevArrowHover = false;
  }
  onNextArrowHover(): void {
    this.nextArrowHover = true;
  }
  onNextArrowLeave(): void {
    this.nextArrowHover = false;
  }

}
