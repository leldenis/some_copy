import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export enum RROTab {
  KEYS = 'keys',
  CARS = 'cars',
}

@Component({
  selector: 'upf-rro-button-toggle-container',
  standalone: true,
  imports: [MatButton, MatIcon, TranslateModule],
  templateUrl: './rro-button-toggle-container.component.html',
  styleUrl: './rro-button-toggle-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RroButtonToggleContainerComponent {
  @Input() public activeTab: RROTab;

  @Output() public toggleTab = new EventEmitter<RROTab>();
  @Output() public openUploadSignatureKeyModal = new EventEmitter();

  public readonly tabs = RROTab;

  public get activeTabKeys(): boolean {
    return this.activeTab === RROTab.KEYS;
  }

  public handlerToggleTab(tab: RROTab): void {
    this.toggleTab.emit(tab);
  }

  public handlerUploadKeyModal(): void {
    this.openUploadSignatureKeyModal.emit();
  }
}
