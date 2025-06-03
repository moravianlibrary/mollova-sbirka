import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { SearchService } from '../services/search.service';
import { GoogleMap } from '@angular/google-maps';
import { Router, ActivatedRoute } from '@angular/router';
import { first, Subject, Subscription } from 'rxjs';
import { EnvironmentService } from '../services/environment.service';
import { HttpRequestCache } from '../services/http-request-cache.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  loading: boolean = false;
  searchLoading: boolean = false;
  searchText: string;
  north: number | null;
  south: number | null;
  east: number | null;
  west: number | null;
  maps: any;
  focusedItem: any;
  itemType: string = 'map';
  results: any;
  mapHidden: boolean = false;
  selectedSort: string = 'relevance';
  sortedResults: any;
  sortQuery: string = '';
  svgIcon: any;

  markerSize: boolean;

  // PAGINATION
  pages: any[] = [];
  displayedFirstPages: any[] = [];
  displayedLastPages: any[] = [];
  currentPage: number;
  lastPage: number;
  from: number;
  to: number;
  count: number;
  searchVisible: boolean = true;

  private subscriptions: Subscription = new Subscription();

  apiThumbUrl = this.envService.get('krameriusBaseUrl') + "/api/client/v7.0/items/";

  // SLIDER
  minValue: number;
  maxValue: number;
  actualInputValueMin: number;
  actualInputValueMax: number;
  options: Options = {
    floor: 1550,
    ceil: 1850,
    showTicks: false,
    hideLimitLabels: true,
    hidePointerLabels: true,
  };

  // GOOGLE MAPS

  boxOptions: google.maps.RectangleOptions = {
    // fillColor: '#d8b600',
    fillOpacity: 0,
    strokeColor: '#d8b600',
    strokeOpacity: 1
  };
  optionsMap: google.maps.MapOptions = {
    mapId: 'ddc5e4cd685923d9',
    center: { lat: 50.0, lng: 20.0 }, // Default center
    zoom: 4,
    zoomControl: true,
    scrollwheel: true,
    mapTypeControl: false,
    streetViewControl: false,
    disableDoubleClickZoom: false,
    fullscreenControl: false,
    clickableIcons: false,
    maxZoom: 15,
    minZoom: 2
  };
  markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {

  };

  @ViewChild('googleMap') googleMap: GoogleMap;

  // private mapIdleSubject = new Subject<void>();
  waitForMapReadyInterval: any;
  initialMapReady: boolean = false;
  skipNextIdle: boolean = true;


  constructor(
    private envService: EnvironmentService,
    public searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private httpRequestCache: HttpRequestCache
  ) { }

  ngOnInit() {
    this.httpRequestCache.clear(); // Vyčistím cache při každém načtení search

    this.loading = true;

    // CEKAM AZ SE NACTE GOOGLE MAPA
    this.waitForMapReadyInterval = setInterval(() => {
      if (this.googleMap?.googleMap) {
        clearInterval(this.waitForMapReadyInterval);
        this.onMapReallyReady();
      }
    }, 200);
  
    // NACTU PARAMETRY A PUSTIM SEARCH
    const paramSub = this.route.queryParams.subscribe(params => {
      console.log('paramsub from ngonInit', params);
      this.loadParams(params);
      this.search();
    });
    this.subscriptions.add(paramSub);

    this.svgIcon = document.createElement('div');
    this.svgIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24.0071 3C30.8016 3.00494 37.7235 7.3152 39.5524 16.0072C41.6736 26.0862 35.8259 34.4574 31.0331 39.4086L24.7394 46.2088C24.3442 46.6358 23.6693 46.6366 23.2731 46.2104L16.9512 39.4103L16.9495 39.4086C12.174 34.4579 6.32646 26.0664 8.44765 15.9874C10.2859 7.29546 17.2125 2.99506 24.0071 3Z" fill="#A08700"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14 19C14 13.4772 18.4772 9 24 9C29.5228 9 34 13.4772 34 19C34 24.5228 29.5228 29 24 29C18.4772 29 14 24.5228 14 19Z" fill="white"/>
      </svg>`;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    if (this.waitForMapReadyInterval) {
      clearInterval(this.waitForMapReadyInterval);
    }
  }

  onMapReallyReady() {
    console.log('Google Map is now ready');
    this.initialMapReady = true;
    console.log('initialMapReady', this.initialMapReady, this.north, this.south, this.east, this.west);
    if (this.north && this.south && this.east && this.west) {
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(this.south, this.west),
        new google.maps.LatLng(this.north, this.east)
      );
      console.log('onMapReallyReady bounds', bounds);
      this.googleMap?.googleMap?.fitBounds(bounds, 0);
    }

    setTimeout(() => {
      this.skipNextIdle = false;
    }, 1000);
  }


  loadParams(params: any) {
    this.searchText = params['searchText'] || '';
    this.north = parseFloat(params['north']) || 65.8;
    this.south = parseFloat(params['south']) || 27.0;
    this.east = parseFloat(params['east']) || 30.6;
    this.west = parseFloat(params['west']) || -5.4;
    this.minValue = parseInt(params['minYear']) || 1550;
    this.maxValue = parseInt(params['maxYear']) || 1850;
    this.actualInputValueMin = this.minValue;
    this.actualInputValueMax = this.maxValue;
    // this.itemType = params['itemType'] || 'map';
    this.currentPage = parseInt(params['page']) || 1;
  }

  updateUrlParams() {
    const queryParams: any = {
      searchText: this.searchText,
      north: this.north,
      south: this.south,
      east: this.east,
      west: this.west,
      minYear: this.minValue,
      maxYear: this.maxValue,
      // itemType: this.itemType,
      page: this.currentPage
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge', // zachová existující parametry
    });
  }

  search() {
    // console.log('======= search() ========');
    this.searchLoading = true;
    const sub = this.searchService.search(this.buildQuery(), this.sortQuery)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.sortedResults = data?.response?.docs || [];
          this.count = data?.response?.numFound || 0;
          this.updatePagination();
          this.searchLoading = false;
          this.loading = false;
  
          setTimeout(() => {
            document.querySelector('.app-results')?.scrollTo({ top: 0 });
            document.querySelector('.app-results')?.classList.add('loaded');
          }, 50);
        },
        error: (err) => {
          console.error('Chyba při načítání výsledků:', err);
          this.loading = false;
          this.searchLoading = false;
        }
      });
    this.subscriptions.add(sub);
  }

  onMapIdle() {
    if (this.skipNextIdle) {
      console.log('Skipping first idle event');
      return;
    }
    console.log('map idle event - not skipping');
    this.currentPage = 1;
    const bounds = this.googleMap.getBounds();
    // console.log('onMapIdle bounds', bounds);
    if (bounds) {
      this.north = bounds.getNorthEast().lat();
      this.south = bounds.getSouthWest().lat();
      this.east = bounds.getNorthEast().lng();
      this.west = bounds.getSouthWest().lng();
      // console.log('map idle zoom', this.googleMap.getZoom(), bounds);
    }
    // this.mapIdleSubject.next();
    this.updateUrlParams();
  }

  sliderValueChanged() {
    // this.search();
    this.updateUrlParams();
  }
  synchronizeYears() {
    this.actualInputValueMin = this.minValue;
    this.actualInputValueMax = this.maxValue;
  }
  onInputFocus() {
    this.actualInputValueMin = this.minValue;
    this.actualInputValueMax = this.maxValue;
  }
  onInputDateSearch() {
    this.minValue = this.actualInputValueMin;
    this.maxValue = this.actualInputValueMax;
    this.updateUrlParams();
  }

  updatePagination() {
    this.from = (this.currentPage - 1) * 100 + 1;
    this.to = this.count < 100 || this.currentPage === this.lastPage
      ? this.count
      : this.currentPage * 100;
  
    this.pages = Array.from({ length: Math.ceil(this.count / 100) }, (_, i) => i + 1);
    this.lastPage = this.pages.length;
  
    if (this.lastPage > 4) {
      if (this.currentPage === 1) {
        this.displayedFirstPages = this.pages.slice(0, 3);
        this.displayedLastPages = [this.lastPage];
      } else if (this.currentPage < this.lastPage - 3) {
        this.displayedFirstPages = this.pages.slice(this.currentPage - 2, this.currentPage + 1);
        this.displayedLastPages = [this.lastPage];
      } else {
        this.displayedFirstPages = [1];
        this.displayedLastPages = this.pages.slice(this.lastPage - 3);
      }
    } else {
      this.displayedFirstPages = this.pages;
    }
  }

  buildQuery() {
    // console.log('buildQuery', this.north, this.south, this.east, this.west);
    let query = 'q=';
    if (this.north && this.south && this.east && this.west) {
      query += `{!field f=coords.bbox score=overlapRatio}Intersects(ENVELOPE(${this.west},${this.east},${this.north},${this.south}))`;
    }

    // filter
    let filter = '&fq=in_collections:"uuid:9b190c71-5a2c-44fa-bc8a-b6c5b056c01a"';
    // if (this.itemType) {
    //   filter += `&fq=(model:${this.itemType}) `;
    // }
    if (this.minValue && this.maxValue) {
      filter += `&fq=((date_range_start.year:[* TO ${this.maxValue}] AND date_range_end.year:[${this.minValue} TO *]))`;
    }
    if (this.searchText) {
      const phrase = this.searchText.trim();
      filter += `&fq=_query_:"{!edismax qf='titles.search^10 authors.search^2 keywords.search geographic_names.search id_isbn shelf_locators' bq='(level:0)^200' bq='(model:page)^0.1' v='${phrase}'};"`
    }
    if (this.currentPage) {
      filter += `&start=${(this.currentPage - 1) * 100}`;
    }
    return query + filter;
  }

  clearSearch() {
    this.searchText = '';
    this.updateUrlParams();
  }
  getImageUrl(pid: string) {
    return `${this.apiThumbUrl}${pid}/image/thumb`;
  }
  highlightMap(item: any) {
    if (!this.googleMap || !this.googleMap.googleMap) {
      console.warn('Google Map is not initialized yet.');
      return;
    }
    this.focusedItem = item;
    let zoom = this.googleMap.getZoom() || 4;
    // BOD
    this.focusedItem.lat = parseFloat(this.focusedItem['coords.bbox.corner_ne'].split(',')[0]);
    this.focusedItem.lng = parseFloat(this.focusedItem['coords.bbox.corner_ne'].split(',')[1]);
    // POLYGON
    this.focusedItem.north = parseFloat(this.focusedItem['coords.bbox.corner_ne'].split(',')[0]);
    this.focusedItem.east = parseFloat(this.focusedItem['coords.bbox.corner_ne'].split(',')[1]);
    this.focusedItem.south = parseFloat(this.focusedItem['coords.bbox.corner_sw'].split(',')[0]);
    this.focusedItem.west = parseFloat(this.focusedItem['coords.bbox.corner_sw'].split(',')[1]);

    let constant = (this.focusedItem.north - this.focusedItem.south) * zoom;
    // console.log('focused', this.focusedItem.north - this.focusedItem.south, this.googleMap.getZoom(), constant);

    if (
      (this.focusedItem['coords.bbox.corner_ne'] === this.focusedItem['coords.bbox.corner_sw'])) {
      this.markerSize = true;
      // BOD
      this.focusedItem.lat = parseFloat(this.focusedItem['coords.bbox.corner_ne'].split(',')[0]);
      this.focusedItem.lng = parseFloat(this.focusedItem['coords.bbox.corner_ne'].split(',')[1]);
    } else if ((this.focusedItem.north - this.focusedItem.south) * zoom < 0.5) {
      this.focusedItem.lat = (this.focusedItem.north + this.focusedItem.south) / 2;
      this.focusedItem.lng = (this.focusedItem.east + this.focusedItem.west) / 2;
      this.markerSize = true;
    } else {
      this.markerSize = false;
    }
  }
  unhighlightMap(map: any) {
    this.focusedItem = null;
    // console.log('leave', map);
  }
  getItemBounds() {
    // console.log('bounds', this.focusedItem.north - this.focusedItem.south, this.focusedItem.east - this.focusedItem.west);
    this.markerSize = false;
    return new google.maps.LatLngBounds(
      new google.maps.LatLng(this.focusedItem.north, this.focusedItem.west),
      new google.maps.LatLng(this.focusedItem.south, this.focusedItem.east)
    );
  }
  getItemPosition() {
    return new google.maps.LatLng(this.focusedItem.lat, this.focusedItem.lng);
  }

  // paginator
  changePage(page: number) {
    if (page < 1 || page > this.lastPage) {
      return;
    }
    this.currentPage = page;
    this.updateUrlParams();
  }

  hideMap() {
    this.mapHidden = true;
    this.north = null;
    this.south = null;
    this.east = null;
    this.west = null;
    this.updateUrlParams();
  }
  showMap() {
    console.log('showMap');
    this.httpRequestCache.clear(); // Vyčistím cache při znovuotevření mapy
    this.mapHidden = false;
    if (this.initialMapReady) {
      console.log('showMap - initialMapReady', this.north, this.south, this.east, this.west);
      this.north = 65.8;
      this.south = 27.0;
      this.east = 30.6;
      this.west = -5.4;
      // this.updateUrlParams();
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(this.south, this.west),
        new google.maps.LatLng(this.north, this.east)
      );
      console.log('showMap bounds', bounds);
      this.googleMap?.fitBounds(bounds, 0);
    }
  }
  toggleSearchVisibility() {
    this.searchVisible = !this.searchVisible;
  }
  sortBy(sort: string) {
    // console.log('sort', sort);
    this.selectedSort = sort;
    if (sort === 'relevance') {
      this.sortQuery = '';
    } else if (sort === 'alphabet') {
      this.sortQuery = '&sort=title.sort asc';
    } else if (sort === 'newest') {
      this.sortQuery = '&sort=date.max desc, date.min desc';
    } else if (sort === 'oldest') {
      this.sortQuery = '&sort=date.min asc, date.max asc';
    }
    // this.updateUrlParams();
    this.search();
  }

}
