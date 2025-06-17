import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { resendAuthCodeInterval, StorageService } from '@ui/core/services/storage.service';
import { CodeInputComponent } from '@ui/shared/components/code-input/code-input.component';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { asyncScheduler, map, Observable, takeWhile, timer } from 'rxjs';

const RESEND_INTERVAL_SECONDS = 60;

@Component({
  selector: 'upf-login-otc',
  standalone: true,
  imports: [FormsModule, LetDirective, ReactiveFormsModule, TranslateModule, AsyncPipe, CodeInputComponent],
  templateUrl: './login-otc.component.html',
  styleUrl: './login-otc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginOtcComponent implements OnInit {
  @Output() public resendCode = new EventEmitter<void>();
  public resendTimer$: Observable<string>;
  constructor(
    private readonly formDirective: FormGroupDirective,
    private readonly destroyRef: DestroyRef,
    private readonly storage: StorageService,
  ) {}

  public get loginForm(): FormGroup {
    return this.formDirective.form;
  }

  public get currentInterval(): number {
    return this.storage.get<number>(resendAuthCodeInterval);
  }

  public ngOnInit(): void {
    this.setResendInterval();
  }

  public resendOtc(): void {
    this.setResendInterval();
    this.loginForm.get('password').reset(null);
  }

  private setResendInterval(): void {
    if (this.currentInterval < Date.now()) {
      const date = new Date();
      date.setSeconds(date.getSeconds() + RESEND_INTERVAL_SECONDS);
      this.storage.set(resendAuthCodeInterval, date.getTime());
      this.resendCode.emit();
    }

    this.setResendTimer();
  }

  private setResendTimer(): void {
    const interval = Math.floor((this.currentInterval - Date.now()) / 1000);

    this.resendTimer$ = timer(0, 1000, asyncScheduler).pipe(
      takeWhile((value) => value <= interval),
      map((value) => {
        const secondsLeft = interval - value;
        if (value === interval) return null;
        return secondsLeft >= 10 ? `0:${secondsLeft}` : `0:0${secondsLeft}`;
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }
}
