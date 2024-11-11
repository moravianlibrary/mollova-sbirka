import { Component, OnDestroy, OnInit } from '@angular/core';
import { CollectionService } from '../services/collection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss'
})
export class CollectionComponent implements OnInit, OnDestroy {

  map: boolean = true;
  
  hoveredAreaFromMap: string | null = null;
  hoveredAreaFromMenu: string | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(private collectionService: CollectionService,
              private route: ActivatedRoute,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      console.log('URL:', url);
      if (url.length === 0 || (url.length === 1 && url[0].path === 'mollova-sbirka')) {
        this.map = true;
      }
    });
    // Subscribe to hover events from menu
    const menuSub = this.collectionService.hoverFromMenu$.subscribe(areaName => {
      this.hoveredAreaFromMenu = areaName;
    });
    this.subscriptions.add(menuSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  navigate(url: string): void {
    if (url) {
      window.location.href = url;
    }
  }

  onMouseEnter(areaName: string): void {
    this.hoveredAreaFromMap = areaName;
    this.collectionService.emitHoverFromMap(areaName);
  }

  onMouseLeave(areaName: string): void {
    this.hoveredAreaFromMap = null;
    this.collectionService.emitHoverFromMap(null);
  }

  shouldHighlight(areaTitle: string): boolean {
    return this.hoveredAreaFromMap === areaTitle || this.hoveredAreaFromMenu === areaTitle;
  }

  mapAreas: any = [
    {
      points: "686,285,700,258,708,266,730,252,773,234,787,223,796,232,810,228,849,241,889,261,941,286,955,321,951,356,925,367,861,372,820,370,802,376,774,385,746,373,753,359,734,352,712,332,718,313,708,310,706,293",
      title: "České země",
      url: "http://www.seznam.cz"
    },
    {
      points: "811,223,803,200,794,170,799,127,745,128,718,130,696,136,686,144,661,151,641,158,629,174,619,189,603,201,607,211,606,226,611,242,631,244,644,250,648,261,668,260,678,268,680,279,702,258,709,265,753,241,775,229,786,217,792,226",
      title: "Itálie",
      url: "http://www.example.com"
    },
    {
      points: "799,137,791,162,800,193,815,224,849,240,896,262,938,285,951,309,1144,255,1138,197,1138,145,1126,87,1096,56,981,36,852,36,815,43,799,87",
      title: "Uhry",
      url: "http://www.seznam.cz"
    }
    // Přidejte další oblasti podle potřeby
  ];
}
