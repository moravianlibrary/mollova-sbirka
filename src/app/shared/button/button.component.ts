import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() iconLeft?: string; // Název ikonky pro levý ikon
  @Input() iconRight?: string; // Název ikonky pro pravý ikon
  @Input() disabled: boolean = false;
}
