
import { Component, Input, OnInit } from '@angular/core';
import { _ } from '@ngx-translate/core';
import OpenSeadragon from 'openseadragon';
import { CollectionService } from '../../../../services/collection.service';

@Component({
  selector: 'app-iiif-image-viewer',
  templateUrl: './iiif-image-viewer.component.html',
  styleUrls: ['./iiif-image-viewer.component.scss']
})
export class IiifImageViewerComponent implements OnInit {
  @Input() pages!: any[]; // Stranky

  pagePid: string = '';
  manifestLink: string = '';
  actualPage: number;
  loadingImage: boolean = true;

  private viewer!: OpenSeadragon.Viewer;

  isFullScreen:boolean = false;

  constructor( private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.pagePid = this.pages[0]['pid'];
    this.actualPage = 1;
    this.manifestLink = 'https://api.kramerius.mzk.cz/search/iiif/' + this.pagePid + '/info.json';
    // this.manifestLink = 'http://localhost:4200/assets/docs/info.json';
    console.log('URL:', this.manifestLink, 'PAGES:', this.pages);
    if (this.manifestLink) {
      this.viewer = OpenSeadragon({
        id: 'openseadragon-viewer',
        // tileSources: {
        //   getTileUrl: (level: number, x: number, y: number) => {
        //     return 'https://api.kramerius.mzk.cz/search/iiif/' + this.pagePid;
        //   }
        // },
        tileSources: this.manifestLink,
        prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/',
        showNavigator: false, // Zobrazit mini mapu
        navigatorPosition: 'BOTTOM_RIGHT', // Pozice navigátoru
        defaultZoomLevel: 0,
        minZoomLevel: 0.5, // Maximální úroveň přiblížení
        maxZoomLevel: 10,
        visibilityRatio: 1, // Viditelnost při posunu (1 = vše viditelné)
        constrainDuringPan: true, // Omezení při posunu
        showZoomControl: false, // Skryje tlačítka zoomování
        showHomeControl: false, // Skryje tlačítko "reset"
        showFullPageControl: false // Skryje tlačítko "fullscreen",
      });
      this.loadingImage = false;
    }

    document.addEventListener("fullscreenchange", () => {
      this.isFullScreen = !!document.fullscreenElement;
    });
  }
  zoomIn(): void {
    if (this.viewer.viewport.getZoom() < 10) {
      this.viewer.viewport.zoomBy(2);
    }
  }
  zoomOut(): void {
    if (this.viewer.viewport.getZoom() > 0.5) {
      this.viewer.viewport.zoomBy(0.5);
    }
  }
  prevPage(): void {
    this.loadingImage = true;
    if (this.actualPage > 1) {
      this.viewer.close();
      this.actualPage--;
      this.pagePid = this.pages[this.actualPage - 1]['pid'];
      this.manifestLink = 'https://api.kramerius.mzk.cz/search/iiif/' + this.pagePid + '/info.json';
      this.viewer.open(this.manifestLink);
      this.loadingImage = false;
    } else {
      this.loadingImage = false;
    }
  }
  nextPage(): void {
    this.loadingImage = true;
    if (this.actualPage < this.pages.length) {
      this.viewer.close();
      this.actualPage++;
      this.pagePid = this.pages[this.actualPage - 1]['pid'];
      this.manifestLink = 'https://api.kramerius.mzk.cz/search/iiif/' + this.pagePid + '/info.json';
      this.viewer.open(this.manifestLink);
      this.loadingImage = false;
    } else {
      this.loadingImage = false;
    }
  }
  toggleFullScreen(): void {
    this.viewer.viewport.goHome();
    const viewerElement = document.getElementById('openseadragon-viewer');

    if (viewerElement) {
      if (!document.fullscreenElement) {
        viewerElement.requestFullscreen().catch(err => console.error("Fullscreen error:", err));
      } else {
        document.exitFullscreen();
      }
    } else {
      console.error('Element #openseadragon-viewer nebyl nalezen!');
    }
  }
  downloadImage(): void {
    window.open(this.manifestLink.replace('/info.json', '/full/full/0/default.jpg'), '_blank');
  }
}

