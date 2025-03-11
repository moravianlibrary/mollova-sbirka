import { Component, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { SearchService } from '../services/search.service';
import { GoogleMap } from '@angular/google-maps';
import { Router, ActivatedRoute } from '@angular/router';
import { first, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  loading: boolean = true;
  searchText: string;
  north: number;
  south: number;
  east: number;
  west: number
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
  count: number;
  searchVisible: boolean = true;

  private subscriptions: Subscription = new Subscription();

  apiThumbUrl = 'https://api.kramerius.mzk.cz/search/api/client/v7.0/items/';

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
  stylesArray: google.maps.MapTypeStyle[] = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text",
      "stylers": [
        {
          "weight": 2.5
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "weight": 1
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        },
        {
          "weight": 0.5
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#000000"
        },
        {
          "weight": 1
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "landscape",
      "stylers": [
        {
          "visibility": "off"
        },
        {
          "weight": 2
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "landscape.natural.terrain",
      "stylers": [
        {
          "color": "#d6d6d6"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "stylers": [
        {
          "color": "#c7cadc"
        },
        {
          "weight": 1
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ];
  boxOptions: google.maps.RectangleOptions = {
    // fillColor: '#d8b600',
    fillOpacity: 0,
    strokeColor: '#d8b600',
    strokeOpacity: 1
  };
  optionsMap: google.maps.MapOptions = {
    // styles: this.stylesArray,
    center: { lat: 50.195060, lng: 12.606837 },
    mapId: 'ddc5e4cd685923d9',
    zoom: 4,
    zoomControl: true,
    scrollwheel: true,
    mapTypeControl: false,
    streetViewControl: false,
    disableDoubleClickZoom: false,
    fullscreenControl: false,
    maxZoom: 15,
    minZoom: 2
  };
  markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {

  };


  @ViewChild('googleMap') googleMap: GoogleMap;

  private mapIdleSubject = new Subject<void>();

  constructor(public searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('lastPage', this.lastPage);
    const paramSub = this.route.queryParams.subscribe(params => {
      console.log('params', params);
      this.searchText = params['searchText'] || '';
      this.north = parseFloat(params['north']) || 65.8;
      this.south = parseFloat(params['south']) || 27.0;
      this.east = parseFloat(params['east']) || 30.6;
      this.west = parseFloat(params['west']) || -5.4;
      this.minValue = parseInt(params['minYear']) || 1550;
      this.maxValue = parseInt(params['maxYear']) || 1850;
      this.actualInputValueMin = this.minValue;
      this.actualInputValueMax = this.maxValue;
      this.itemType = params['itemType'] || 'map';
      this.currentPage = parseInt(params['page']) || 1;
  
      // Načtení dat po aktualizaci parametrů
      this.searchService.search(this.buildQuery(), this.sortQuery);
      this.searchService.results$.subscribe((data: any) => {
        this.sortedResults = data['response']['docs'];
        this.count = data['response']['numFound'];
        if (this.count > 100) {
          this.pages = Array.from({length: Math.ceil(this.count / 100)}, (_, i) => i + 1);
          this.lastPage = this.pages.length;
          if (this.lastPage > 4) {
            if (this.currentPage === 1) {
              this.displayedFirstPages = this.pages.slice(0, 3);
              this.displayedLastPages = [this.lastPage];
            } else if (this.currentPage > 1 && this.currentPage < this.lastPage - 3) {
              this.displayedFirstPages = this.pages.slice(this.currentPage - 2, this.currentPage + 1);
              this.displayedLastPages = [this.lastPage];
            } else {
              this.displayedFirstPages = [1];
              this.displayedLastPages = this.pages.slice(this.lastPage - 3, this.lastPage);
            }
          } else {
            this.displayedFirstPages = this.pages;
          }
        } else {
          this.pages = Array.from({length: Math.ceil(this.count / 100)}, (_, i) => i + 1);
          this.currentPage = 1;
        }
        this.loading = false;
        setTimeout(() => {
          document.querySelector('.app-results')?.classList.add('loaded');
        }, 50); // Krátké zpoždění, aby animace správně fungovala
      });
    });

    this.mapIdleSubject.pipe(debounceTime(500)).subscribe(() => {
      this.search();
  });
    this.subscriptions.add(paramSub);

    this.svgIcon = document.createElement('div');
    this.svgIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24.0071 3C30.8016 3.00494 37.7235 7.3152 39.5524 16.0072C41.6736 26.0862 35.8259 34.4574 31.0331 39.4086L24.7394 46.2088C24.3442 46.6358 23.6693 46.6366 23.2731 46.2104L16.9512 39.4103L16.9495 39.4086C12.174 34.4579 6.32646 26.0664 8.44765 15.9874C10.2859 7.29546 17.2125 2.99506 24.0071 3Z" fill="#A08700"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14 19C14 13.4772 18.4772 9 24 9C29.5228 9 34 13.4772 34 19C34 24.5228 29.5228 29 24 29C18.4772 29 14 24.5228 14 19Z" fill="white"/>
      </svg>
      `;

    // if (this.googleMap) {
    //   console.log('map', this.googleMap, this.north, this.south, this.east, this.west);
    //   const bounds = new google.maps.LatLngBounds(
    //       new google.maps.LatLng(this.south, this.west),
    //       new google.maps.LatLng(this.north, this.east)
    //   );
    //   this.googleMap.fitBounds(bounds);
    // } else {
    //   setTimeout(() => {    
    //     console.log('map', this.googleMap, this.north, this.south, this.east, this.west);
    //     const bounds = new google.maps.LatLngBounds(
    //         new google.maps.LatLng(this.south, this.west),
    //         new google.maps.LatLng(this.north, this.east)
    //     );
    //     this.googleMap.fitBounds(bounds);
    //   }, 1000);
    // }

  }

  sliderValueChanged() {
    this.search();
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
    this.search();
  }


  search() {
    this.updateUrlParams();
    this.searchService.search(this.buildQuery(), this.sortQuery);
    setTimeout(() => {
      document.querySelector('.app-results')?.scrollTo({ top: 0 });
    }, 400);
  }

  buildQuery() {
    // query
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
      filter += `&fq=_query_:"{!edismax qf='titles.search^10 authors.search^2 keywords.search geographic_names.search id_isbn shelf_locators' bq='(level:0)^200' bq='(model:page)^0.1' v=${this.searchText}}"`
    }
    if (this.currentPage) {
      filter += `&start=${(this.currentPage - 1) * 100}`;
    }
    console.log('query', query + filter);
    return query + filter;
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
      itemType: this.itemType,
      page: this.currentPage
    };
  
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge', // zachová existující parametry
    });
  }

  clearSearch() {
    this.searchText = '';
    this.search();
  }
  getImageUrl(pid: string) {
    return `${this.apiThumbUrl}${pid}/image/thumb`;
  }
  highlightMap(item: any) {
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
    console.log('focused', this.focusedItem.north - this.focusedItem.south, this.googleMap.getZoom(), constant);

    if (
      (this.focusedItem['coords.bbox.corner_ne'] === this.focusedItem['coords.bbox.corner_sw'])) {
      this.markerSize = true;
      // BOD
      this.focusedItem.lat = parseFloat(this.focusedItem['coords.bbox.corner_ne'].split(',')[0]);
      this.focusedItem.lng = parseFloat(this.focusedItem['coords.bbox.corner_ne'].split(',')[1]);
    } else if ((this.focusedItem.north - this.focusedItem.south) * zoom < 0.16) {
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

  onMapIdle() {
    this.currentPage = 1;
    const bounds = this.googleMap.getBounds();
    if (bounds) {
      this.north = bounds.getNorthEast().lat();
      this.south = bounds.getSouthWest().lat();
      this.east = bounds.getNorthEast().lng();
      this.west = bounds.getSouthWest().lng();
      console.log('map idle zoom', this.googleMap.getZoom(), bounds);
    }
    this.mapIdleSubject.next();
  }

  // paginator
  changePage(page: number) {
    this.currentPage = page;
    this.search();
  }

  hideMap() {
    this.mapHidden = true;
  }
  showMap() {
    this.mapHidden = false;
  }
  toggleSearchVisibility() {
    this.searchVisible = !this.searchVisible;
  }
  sortBy(sort: string) {
    console.log('sort', sort);
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
    this.search();
  }

}
