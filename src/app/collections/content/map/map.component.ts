import { Component, ElementRef, ViewChild, Input, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  @Input() map: any = {};
  @Input() parentCollection: any = {};
  @Input() siblings: any[] = [];

  loading: boolean = true;
  pagePid: string = '';
  manifestLink: string = '';

  @ViewChild('infoDiv', { static: false }) infoDiv!: ElementRef; // Reference na app-part-info
  @ViewChild('mapDiv', { static: false }) mapDiv!: ElementRef; // Reference na app-part-map
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  showMoreInfo = false; // Stav tlačítka

  private observer!: IntersectionObserver;

  constructor(private translate: TranslateService,
              private collectionService: CollectionService) { }

  ngOnInit(): void {
    console.log('Map:', this.map, this.parentCollection, this.siblings);
    this.collectionService.getPagesByPid(this.map['pid']).subscribe((data: any) => {
      console.log('Pages:', data['response']['docs'][0]);
      this.pagePid = data['response']['docs'][0]['pid'];
      this.manifestLink = 'https://api.kramerius.mzk.cz/search/iiif/' + this.pagePid + '/info.json';
      console.log(this.manifestLink);
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

}
