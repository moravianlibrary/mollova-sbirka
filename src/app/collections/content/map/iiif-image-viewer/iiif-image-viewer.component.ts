
import { Component, Input, OnInit } from '@angular/core';
import OpenSeadragon from 'openseadragon';

@Component({
  selector: 'app-iiif-image-viewer',
  templateUrl: './iiif-image-viewer.component.html',
  styleUrls: ['./iiif-image-viewer.component.scss']
})
export class IiifImageViewerComponent implements OnInit {
  @Input() infoJsonUrl!: string; // URL na IIIF info.json

  private viewer!: OpenSeadragon.Viewer;

  constructor() {}

  ngOnInit(): void {
    console.log('URL:', this.infoJsonUrl);
    if (this.infoJsonUrl) {
      this.viewer = OpenSeadragon({
        id: 'openseadragon-viewer',
        tileSources: this.infoJsonUrl, // Pouze URL na IIIF Image API
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
        showFullPageControl: false // Skryje tlačítko "fullscreen"
      });
    }
  }
  zoomIn(): void {
    this.viewer.viewport.zoomBy(2);
  }
  zoomOut(): void {
    this.viewer.viewport.zoomBy(0.5);
  }
  toggleFullScreen(): void {
    this.viewer.viewport.goHome();
  }
  downloadImage(): void {
    console.log('Stáhnout obrázek');
  }
}

