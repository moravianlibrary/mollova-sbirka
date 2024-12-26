import { Component, OnDestroy, OnInit } from '@angular/core';
import { CollectionService } from '../services/collection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss'
})
export class CollectionsComponent implements OnInit, OnDestroy {

  map: boolean = true;
  collectionPid: string | null = null;
  
  hoveredAreaFromMap: string | null = null;
  hoveredAreaFromMenu: string | null = null;

  mapAreas2: any = [];

  private subscriptions: Subscription = new Subscription();

  constructor(private collectionService: CollectionService,
              private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService
  ) { }

  ngOnInit(): void {
    const urlSub = this.route.url.subscribe((url) => {
      console.log('URL:', url);
      if (url.length === 0 || (url.length === 1 && url[0].path === 'mollova-sbirka')) {
        this.router.navigate(['/mollova-sbirka']);
        this.map = true;
      } else {
        this.collectionPid = url[1].path;
        this.collectionService.setContext(this.collectionPid);
        this.map = false;
      }
    });
    this.subscriptions.add(urlSub);

    // Subscribe to hover events from menu
    const menuSub = this.collectionService.hoverFromMenu$.subscribe(areaName => {
      this.hoveredAreaFromMenu = areaName;
    });
    this.subscriptions.add(menuSub);

    // Subscribe to collection structure
    const collectionStructureSub = this.collectionService.collectionStructure$.subscribe(structure => {
      if (structure) {
        for (const item of structure) {
          for (const child of item.children) {
            this.mapAreas2.push({
              points: child.points,
              title: child.title
            });
          }
        }
      }
      console.log('Map areas:', this.mapAreas2);
    });
    this.subscriptions.add(collectionStructureSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getCollectionPid(): string {
    return this.collectionPid || '';
  }

  navigate(title: string): void {
    if (title) {
      console.log('Navigate to:', this.collectionService.collectionIndex);
      let url = Object.keys(this.collectionService.collectionIndex).find(pid => this.collectionService.collectionIndex[pid] === title);
      console.log('url:', url);
      this.router.navigate(['/mollova-sbirka', url]);
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
      points: "682,286,700,265,706,269,723,255,751,243,769,234,787,225,795,238,811,230,807,204,798,200,794,173,841,156,857,185,871,180,885,186,905,182,928,205,950,227,969,251,981,269,983,294,986,311,995,325,995,339,955,341,949,357,937,364,918,371,894,371,877,378,857,364,840,368,824,368,812,376,788,381,774,384,755,377,754,364,743,357,735,353,723,341,709,332,716,319,709,310,704,295",
      title: "České země"
    },
    {
      points: "684,317,689,291,708,298,710,306,713,319,709,331,722,339,733,356,751,364,757,380,771,381,754,391,754,415,753,424,745,425,751,453,773,460,803,456,804,466,769,470,747,481,727,482,713,478,709,453,693,450,677,462,625,464,640,436,635,425,633,397,628,381,629,372,633,363,648,367,674,360,677,334",
      title: "Bavorský kraj"
    },
    {
      points: "773,383,812,376,823,367,843,367,859,362,879,375,914,367,925,404,906,424,902,436,909,448,910,463,910,478,926,501,901,500,905,526,888,537,873,550,879,566,833,578,828,591,806,567,794,559,773,558,759,565,745,557,746,541,758,530,762,518,743,520,738,513,712,516,702,508,693,513,685,518,668,523,673,541,661,551,651,574,637,579,628,574,615,578,610,558,615,535,616,523,612,510,595,508,588,497,586,484,586,473,598,467,617,467,631,465,649,466,676,465,689,453,700,453,709,450,709,465,712,478,731,483,746,482,769,470,782,471,804,470,804,453,786,460,765,458,751,452,747,440,741,426,754,432,753,405,754,395",
      title: "Rakouský kraj"
    },
    {
      points: "996,335,1016,351,1040,352,1060,358,1091,350,1125,358,1159,368,1183,368,1203,373,1222,388,1224,407,1263,421,1272,392,1280,371,1296,360,1321,360,1349,373,1383,383,1422,395,1446,417,1466,419,1466,619,1420,638,1367,641,1321,629,1260,633,1222,646,1195,648,1170,658,1122,671,1068,678,1063,734,1028,723,1014,709,987,711,979,724,969,720,1000,693,990,685,963,671,934,656,890,636,849,626,820,620,830,592,835,581,880,566,876,551,908,524,902,503,928,502,912,479,910,450,905,434,906,424,928,401,917,373,947,358,955,335",
      title: "Uhry"
    }
    // Přidejte další oblasti podle potřeby
  ];

  // <!-- Image Map Generated by http://www.image-map.net/ -->
  // <img src="0a771c361e59c454d88e7fc4e2103304.jpeg" usemap="#image-map">
  
  // <map name="image-map">
  //     <area target="" alt="" title="" href="" coords="682,286,700,265,706,269,723,255,751,243,769,234,787,225,795,238,811,230,807,204,798,200,794,173,841,156,857,185,871,180,885,186,905,182,928,205,950,227,969,251,981,269,983,294,986,311,995,325,995,339,955,341,949,357,937,364,918,371,894,371,877,378,857,364,840,368,824,368,812,376,788,381,774,384,755,377,754,364,743,357,735,353,723,341,709,332,716,319,709,310,704,295" shape="poly">
  //     <area target="" alt="" title="" href="" coords="773,383,812,376,823,367,843,367,859,362,879,375,914,367,925,404,906,424,902,436,909,448,910,463,910,478,926,501,901,500,905,526,888,537,873,550,879,566,833,578,828,591,806,567,794,559,773,558,759,565,745,557,746,541,758,530,762,518,743,520,738,513,712,516,702,508,693,513,685,518,668,523,673,541,661,551,651,574,637,579,628,574,615,578,610,558,615,535,616,523,612,510,595,508,588,497,586,484,586,473,598,467,617,467,631,465,649,466,676,465,689,453,700,453,709,450,709,465,712,478,731,483,746,482,769,470,782,471,804,470,804,453,786,460,765,458,751,452,747,440,741,426,754,432,753,405,754,395" shape="poly">
  //     <area target="" alt="" title="" href="" coords="684,317,689,291,708,298,710,306,713,319,709,331,722,339,733,356,751,364,757,380,771,381,754,391,754,415,753,424,745,425,751,453,773,460,803,456,804,466,769,470,747,481,727,482,713,478,709,453,693,450,677,462,625,464,640,436,635,425,633,397,628,381,629,372,633,363,648,367,674,360,677,334" shape="poly">
  //     <area target="" alt="" title="" href="" coords="996,335,1016,351,1040,352,1060,358,1091,350,1125,358,1159,368,1183,368,1203,373,1222,388,1224,407,1263,421,1272,392,1280,371,1296,360,1321,360,1349,373,1383,383,1422,395,1446,417,1466,419,1466,619,1420,638,1367,641,1321,629,1260,633,1222,646,1195,648,1170,658,1122,671,1068,678,1063,734,1028,723,1014,709,987,711,979,724,969,720,1000,693,990,685,963,671,934,656,890,636,849,626,820,620,830,592,835,581,880,566,876,551,908,524,902,503,928,502,912,479,910,450,905,434,906,424,928,401,917,373,947,358,955,335" shape="poly">
  // </map>
}
