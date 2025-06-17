import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DriverDenyListDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Component({
  selector: 'upf-driver-deny-list',
  standalone: true,
  imports: [TranslateModule, MatIconButton, MatIcon, MatDialogClose, MatButton],
  templateUrl: './driver-deny-list.component.html',
  styleUrls: ['./driver-deny-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverDenyListComponent {
  @ViewChild('dialog', { static: true })
  public dialogRef: TemplateRef<unknown>;

  @Input() public denyList: DriverDenyListDto;

  @Output() public clearBackList = new EventEmitter<void>();

  constructor(private readonly dialog: MatDialog) {}

  public onClearDenyList(): void {
    this.dialog
      .open(this.dialogRef)
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.clearBackList.emit());
  }
}
