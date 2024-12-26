import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  @Input() map: any = {};
  @Input() parentCollection: any = {};
  @Input() siblings: any[] = [];

  constructor(private translate: TranslateService,
              private collectionService: CollectionService) { }

  ngOnInit(): void {
    console.log('Map:', this.map, this.parentCollection, this.siblings);
    this.collectionService.getPagesByPid(this.map['pid']).subscribe((data: any) => {
      console.log('Pages:', data['response']['docs'][0]);
    });
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

}
