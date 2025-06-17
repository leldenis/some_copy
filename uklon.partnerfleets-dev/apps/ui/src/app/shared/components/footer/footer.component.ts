import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'upf-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="footer" [style.left.px]="leftPosition">
      <ng-content></ng-content>
    </footer>
  `,
  styles: [
    `
      .footer {
        position: fixed;
        right: 16px;
        bottom: 0;
        display: flex;
        height: 80px;
        justify-content: flex-end;
        align-items: center;
        padding: 16px;
        background: #ffffff;
        box-shadow: 0 0 8px rgba(0, 0, 0, 5%);
        border-radius: 8px 8px 0 0;
        z-index: 10;
      }

      @media (max-width: 767px) {
        .footer {
          left: 0;
          right: 0;
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @Input() public leftPosition = 86;
}
