import { Component, OnDestroy, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, OnDestroy {
  collectionStructure = [];

  hoveredArea: string | null = null;
  subscription: Subscription = new Subscription();
  loading: any = true;

  collectionStructure$ = this.collectionService.collectionStructure$; // Observable for async pipe

  constructor(private collectionService: CollectionService,
              private route: ActivatedRoute,
              private router: Router
  ) { }

  ngOnInit() {
    this.route.url.subscribe((url) => {
      console.log('URL:', url);
      if (url.length === 0) {
        this.router.navigate(['/mollova-sbirka']);
      }
    });
    this.collectionService.loadCollectionStructure(); // Trigger the load
    // Subscribe to hover events from map
    const mapSub = this.collectionService.hoverFromMap$.subscribe(areaName => {
      this.hoveredArea = areaName;
    });

    this.subscription.add(mapSub);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  navigate(url: string): void {
    if (url) {
      this.router.navigate([url, {relativeTo: this.route}]);
    }
  }

  onMenuMouseEnter(areaName: string): void {
    this.collectionService.emitHoverFromMenu(areaName);
  }

  onMenuMouseLeave(): void {
    this.collectionService.emitHoverFromMenu(null);
  }

}
