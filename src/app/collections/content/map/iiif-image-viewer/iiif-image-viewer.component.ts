
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import OpenSeadragon from 'openseadragon';

@Component({
  selector: 'app-iiif-image-viewer',
  templateUrl: './iiif-image-viewer.component.html',
  styleUrls: ['./iiif-image-viewer.component.scss']
})
export class IiifImageViewerComponent implements OnInit {
  @Input() infoJsonUrl!: string; // URL na IIIF info.json

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    if (this.infoJsonUrl) {
      OpenSeadragon({
        id: 'openseadragon-viewer',
        tileSources: this.infoJsonUrl, // Pouze URL na IIIF Image API
        prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/',
        showNavigator: true,
        defaultZoomLevel: 0,
        maxZoomLevel: 10,
        visibilityRatio: 1,
        constrainDuringPan: true
      });
    }
  }
}

