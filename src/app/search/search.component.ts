import { Component, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { SearchService } from '../services/search.service';
import { GoogleMap } from '@angular/google-maps';
import { Router, ActivatedRoute } from '@angular/router';
import { first, Subscription } from 'rxjs';


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

  // PAGINATION
  pages: any[] = [];
  displayedFirstPages: any[] = [];
  displayedLastPages: any[] = [];
  currentPage: number;
  lastPage: number;
  count: number;

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
    styles: this.stylesArray,
    center: { lat: 50.195060, lng: 12.606837 },
    zoom: 4,
    mapTypeId: 'terrain',
    zoomControl: true,
    scrollwheel: true,
    mapTypeControl: false,
    streetViewControl: false,
    disableDoubleClickZoom: false,
    maxZoom: 15,
    minZoom: 2
  };

  @ViewChild('googleMap') googleMap: GoogleMap;

  constructor(public searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
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
      this.searchService.search(this.buildQuery());
      this.searchService.results$.subscribe((data: any) => {
        this.results = data['response']['docs'];
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
          
        }
        this.loading = false;
      });
    });
    this.subscriptions.add(paramSub);

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
    this.searchService.search(this.buildQuery());
  }

  buildQuery() {
    // query
    let query = 'q=';
    if (this.north && this.south && this.east && this.west) {
      query += `{!field f=coords.bbox score=overlapRatio}Intersects(ENVELOPE(${this.west},${this.east},${this.north},${this.south}))`;
    } 

    // filter
    let filter = '&fq=in_collections:"uuid:9b190c71-5a2c-44fa-bc8a-b6c5b056c01a"';
    if (this.itemType) {
      filter += `&fq=(model:${this.itemType}) `;
    }
    if (this.minValue && this.maxValue) {
      filter += `&fq=((date_range_start.year:[* TO ${this.maxValue}] AND date_range_end.year:[${this.minValue} TO *]))`;
    }
    if (this.searchText) {
      filter += `&fq=_query_:"{!edismax qf='titles.search^10 authors.search^2 keywords.search id_isbn shelf_locators' bq='(level:0)^200' bq='(model:page)^0.1' v=${this.searchText}}"`
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
    if (this.focusedItem['coords.bbox.corner_ne'] === this.focusedItem['coords.bbox.corner_sw']) {
      this.focusedItem.lat = parseFloat(this.focusedItem['coords.bbox.center'].split(',')[0]);
      this.focusedItem.lng = parseFloat(this.focusedItem['coords.bbox.center'].split(',')[1]);
    }
    this.focusedItem.north = parseFloat(this.focusedItem['coords.bbox.corner_ne'].split(',')[0]);
    this.focusedItem.east = parseFloat(this.focusedItem['coords.bbox.corner_ne'].split(',')[1]);
    this.focusedItem.south = parseFloat(this.focusedItem['coords.bbox.corner_sw'].split(',')[0]);
    this.focusedItem.west = parseFloat(this.focusedItem['coords.bbox.corner_sw'].split(',')[1]);
  }
  unhighlightMap(map: any) {
    this.focusedItem = null;
    // console.log('leave', map);
  }
  getItemBounds() {
    return new google.maps.LatLngBounds(
      new google.maps.LatLng(this.focusedItem.north, this.focusedItem.west),
      new google.maps.LatLng(this.focusedItem.south, this.focusedItem.east));
  }
  onMapIdle() {
    const bounds = this.googleMap.getBounds();
    if (bounds) {
      this.north = bounds.getNorthEast().lat();
      this.south = bounds.getSouthWest().lat();
      this.east = bounds.getNorthEast().lng();
      this.west = bounds.getSouthWest().lng();
      console.log('map idle', bounds);
    }
    this.search();
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


}
