import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent, ToastType } from '@ui/shared';

const DEFAULT_DURATION = 10_000;

@Injectable()
export class ToastService {
  constructor(private readonly snackBar: MatSnackBar) {}

  public success(text: string, params = {}, duration = DEFAULT_DURATION): void {
    this.open(text, duration, ToastType.SUCCESS, params);
  }

  public warn(text: string, params = {}, duration = DEFAULT_DURATION): void {
    this.open(text, duration, ToastType.WARN, params);
  }

  public error(text: string, params = {}, duration = DEFAULT_DURATION): void {
    this.open(text, duration, ToastType.ERROR, params);
  }

  private open(text: string, duration: number, type: ToastType, params = {}): void {
    this.snackBar.openFromComponent(ToastComponent, {
      duration,
      data: {
        type,
        text,
        params,
      },
      panelClass: `custom-toast`,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }
}
