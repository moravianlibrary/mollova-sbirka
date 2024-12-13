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
  collectionStructure$ = this.collectionService.collectionStructure$; // Observable for async pipe
  loading: any;

  hoveredArea: string | null = null;
  subscription: Subscription = new Subscription();
  openedChild = '';
  activeChild = '';
  hoveredIcon: string | null = null;

  constructor(private collectionService: CollectionService,
              private route: ActivatedRoute,
              private router: Router
  ) { }

  ngOnInit() {
    // Load collection structure
    if (this.collectionStructure.length === 0) {
      this.collectionService.loadCollectionStructure();
    }

    // Redirect to default page if no URL is provided
    const urlSub = this.route.url.subscribe((url) => {
      if (url.length === 0) {
        this.router.navigate(['/mollova-sbirka']);
      } else if (url.length === 2) {
        const pid = url[1]?.path;
        if (!pid) {
          console.error('Invalid URL path:', url);
          return;
        }
        // const collectionIndexSub = this.collectionService.collectionIndex$.subscribe((collectionIndex) => {
        //   if (collectionIndex) {
        //     const childItemName = collectionIndex[pid];
        //     if (childItemName) {
        //       this.onOpenChild(childItemName);
        //     } else {
        //       console.warn('Child item not found for pid:', pid);
        //     }
        //   } else {
        //     console.warn('Collection index is not available.');
        //   }
        // });
        // this.subscription.add(collectionIndexSub);
        const collectionStructureSub = this.collectionService.collectionStructure$.subscribe((collectionStructure) => {
          if (collectionStructure) {
            console.log('Collection structure:', collectionStructure);
            for (const item of collectionStructure) {
              for (const child of item.children) {
                if (child.pid === pid) {
                  this.onOpenChild(child.title);
                  this.activeChild = child.title;
                  break;
                } else {
                  for (const subChild of child.children) {
                    if (subChild.pid === pid) {
                      this.onOpenChild(child.title);
                      this.activeChild = subChild.title;
                      break;
                    }
                  }
                }
              }
            }
          } else {
            console.warn('Collection structure is not available.');
          }
        });
        this.subscription.add(collectionStructureSub);
      }
    });
    this.subscription.add(urlSub);

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

  handleClick(item: any): void {
    console.log('handleClick', item);
    if (this.openedChild === item.title) {
      this.openedChild = '';
    } else {
      this.openedChild = item.title;
    }
    this.navigate(item.pid);
  }
  handleSubClick(openItem: any, child: any): void {
    console.log('handleSubClick', openItem, child);
    this.openedChild = openItem;
    this.navigate(child.pid);
  }

  navigate(url: string): void {
    if (url && url.trim()) {
      this.router.navigate(['/mollova-sbirka', url]);
    }
  }

  onOpenChild(item: any): void {
    this.openedChild = item;
  }

  onCloseChild(item: any): void {
    this.openedChild = '';
  }

  onMenuMouseEnter(areaName: string): void {
    this.collectionService.emitHoverFromMenu(areaName);
  }

  onMenuMouseLeave(): void {
    this.collectionService.emitHoverFromMenu(null);
  }

  onIconHover(title: string): void {
    this.hoveredIcon = title;
}

  onIconLeave(): void {
    this.hoveredIcon = null;
  }

}
