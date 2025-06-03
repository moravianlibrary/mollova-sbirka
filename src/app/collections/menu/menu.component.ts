import { Component, OnDestroy, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, OnDestroy {
  collectionStructure = [];
  collectionStructure$ = this.collectionService.collectionStructure$; // Observable for async pipe
  loading: any;

  currentLang: string;

  hoveredArea: string | null = null;
  subscription: Subscription = new Subscription();
  openedChild = '';
  activeChild = '';
  hoveredIcon: string | null = null;

  childrenExtended: boolean = false;

  constructor(private collectionService: CollectionService,
              private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang;
   }

  ngOnInit() {
    // Language change subscription
    const langSub = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
    this.subscription.add(langSub);

    // Load collection structure
    if (this.collectionStructure.length === 0) {
      this.collectionService.loadCollectionStructure();
      this.collectionService.getCollectionStructureFromJSON().subscribe((data) => {
        this.collectionStructure = data;
      }); 
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
        const collectionStructureSub = this.collectionService.getCollectionStructureFromJSON().subscribe((collectionStructure) => {  
          if (collectionStructure) {
            let found = false;

            for (const item of collectionStructure) {
              for (const child of item.children) {
                if (child.pid === pid) {
                  this.onOpenChild(child.title);
                  this.activeChild = child.title;
                  found = true;
                  break;
                }
                if (child.children) {
                  for (const subChild of child.children) {
                    if (subChild.pid === pid) {
                      this.onOpenChild(child.title);
                      this.activeChild = subChild.title;
                      found = true;
                      break;
                    }
                  }
                }
                if (found) {
                  break;
                }
              }
              if (found) {
                break;
              }
            }

            if (!found) {
              this.collectionService.getParentPid(pid).subscribe((parentPid) => {
                for (const item of collectionStructure) {
                  for (const child of item.children) {
                    if (child.pid === parentPid) {
                      this.onOpenChild(child.title);
                      this.activeChild = child.title;
                      break;
                    } else if (child.children) {
                      for (const subChild of child.children) {
                        if (subChild.pid === parentPid) {
                          this.onOpenChild(child.title);
                          this.activeChild = subChild.title;
                          break;
                        }
                      }
                    }
                  }
                }
              });
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
    if (this.openedChild === item.title) {
      this.openedChild = '';
    } else {
      this.openedChild = item.title;
    }
    this.childrenExtended = false;
    this.navigate(item.pid);
  }

  handleSubClick(openItem: any, child: any): void {
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

  extendChildren() {
    this.childrenExtended = !this.childrenExtended;
  }

}
