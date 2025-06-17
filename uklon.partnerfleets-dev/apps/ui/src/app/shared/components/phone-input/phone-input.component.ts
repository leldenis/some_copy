/* eslint-disable id-denylist, unicorn/prefer-set-has,id-blacklist */
import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { COUNTRY_PHONE_PROPS, POPULAR_COUNTRY_ORDER } from '@constant';
import { CountryPhoneFormatDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { PhoneInputIntlService } from '@ui/core/services/phone-input-intl.service';
import { ICONS } from '@ui/shared/tokens';
import { isPossiblePhoneNumber, isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { NgxMaskDirective } from 'ngx-mask';
import { BehaviorSubject, map, Observable, shareReplay, startWith, Subject, takeUntil, tap } from 'rxjs';

import { AccountCountry } from '@uklon/types';

const DEFAULT_COUNTRY_FORMAT: CountryPhoneFormatDto = Object.freeze({
  country_code: AccountCountry.Ukraine,
  phone_prefix: '+380',
  phone_body_length: 9,
});

const POPULAR_COUNTRIES: string[] = [AccountCountry.Ukraine, AccountCountry.Uzbekistan];

interface GroupedCountries {
  popular: CountryPhoneFormatDto[];
  regular: CountryPhoneFormatDto[];
}

@Component({
  selector: 'upf-phone-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    OverlayModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    NgxMaskDirective,
    TranslateModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneInputComponent implements ControlValueAccessor, Validators, OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkOverlayOrigin, { static: false })
  public origin: CdkOverlayOrigin;

  @Input() public hasLabel = true;
  @Input() public hasSuffix = false;
  @Input() public countryCode: string = AccountCountry.Ukraine;

  @Input() public set formats(formats: CountryPhoneFormatDto[]) {
    if (formats) {
      this.countryPhoneFormats = formats;
      this.groupCountries();
      const currentFormat = this.countryPhoneFormats.find((item) => item.country_code === this.countryCode);
      this.handleCountryCodeChange(currentFormat);
    }
  }

  @Output() public countryChange = new EventEmitter<CountryPhoneFormatDto>();

  public phoneGroup = new FormGroup({
    prefix: new FormControl('+380'),
    number: new FormControl('', Validators.required),
  });

  public filterControl = new FormControl<string>('');
  public isOpened = false;
  public panelWidth: number;
  public groupedCountries: GroupedCountries = { popular: [], regular: [] };
  public translations: Record<string, string>;

  public readonly icons = inject(ICONS);
  public readonly intlService = inject(PhoneInputIntlService);

  public filterChanges$: Observable<string> = this.filterControl.valueChanges.pipe(shareReplay(1));
  public mask$: BehaviorSubject<string> = new BehaviorSubject(COUNTRY_PHONE_PROPS[this.countryCode].mask);
  public placeholder$: BehaviorSubject<string> = new BehaviorSubject(COUNTRY_PHONE_PROPS[this.countryCode].placeholder);
  public filteredCountriesPopular$: Observable<CountryPhoneFormatDto[]> = this.filterChanges$.pipe(
    startWith(''),
    map((value) => this.filterCountries(this.groupedCountries.popular, value)),
  );
  public filteredCountriesRegular$: Observable<CountryPhoneFormatDto[]> = this.filterChanges$.pipe(
    startWith(''),
    map((value) => this.filterCountries(this.groupedCountries.regular, value)),
  );

  private countryPhoneFormats: CountryPhoneFormatDto[] = [];
  private readonly destroyed$: Subject<void> = new Subject();

  public ngOnInit(): void {
    this.handleFormValueChange();
    this.getTranslations();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.panelWidth = this.origin.elementRef.nativeElement.getBoundingClientRect().width;
    });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public onChange = (_: string): void => {};
  public onTouched = (): void => {};

  public writeValue(phoneNumber: string): void {
    if (!phoneNumber) {
      return;
    }

    if (!isValidPhoneNumber(phoneNumber) && phoneNumber.startsWith('+')) {
      this.phoneGroup.patchValue({
        prefix: phoneNumber,
      });
      return;
    }

    const { countryCallingCode, nationalNumber, country } = parsePhoneNumber(phoneNumber);
    this.countryCode = country;
    this.phoneGroup.patchValue({
      prefix: `+${countryCallingCode}`,
      number: nationalNumber,
    });
  }

  public registerOnChange(fn: () => object): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => object): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.phoneGroup.disable() : this.phoneGroup.enable();
  }

  public validate(): ValidationErrors | null {
    const { prefix, number } = this.phoneGroup.value;
    return isPossiblePhoneNumber(`${prefix}${number}`) ? null : { invalidNumber: true };
  }

  public openOverlay(event: Event): void {
    event.stopPropagation();
    this.isOpened = true;
    setTimeout(() => this.scrollToSelectedItem());
  }

  public handleCountryCodeChange(country: CountryPhoneFormatDto = DEFAULT_COUNTRY_FORMAT): void {
    this.handleOverlayClose();
    this.countryCode = country.country_code;

    if (this.phoneGroup.value.prefix !== country.phone_prefix) {
      this.phoneGroup.patchValue({ prefix: country.phone_prefix, number: '' });
    }

    this.updateMaskAndPlaceholder(country);
    this.countryChange.emit(country);
  }

  public scrollToSelectedItem(): void {
    // eslint-disable-next-line unicorn/prefer-query-selector
    const selectedOption = document.getElementById(`upf-country-code-${this.countryCode}`);

    if (selectedOption) {
      selectedOption.scrollIntoView({ block: 'center' });
    }
  }

  public handleOverlayClose(): void {
    this.isOpened = false;
    this.filterControl.reset('');
  }

  private getTranslations(): void {
    this.intlService
      .getTranslations()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((translations) => {
        this.translations = translations;
      });
  }

  private handleFormValueChange(): void {
    this.phoneGroup.valueChanges
      .pipe(
        tap(({ number }) => {
          if (this.countryCode === AccountCountry.Ukraine && number.startsWith('0')) {
            this.phoneGroup.get('number').setValue(number.slice(1), { emitEvent: false });
          }
        }),
        takeUntil(this.destroyed$),
      )
      .subscribe(({ prefix, number }) => {
        this.validate();
        this.onChange(`${prefix}${number}`);
      });
  }

  private updateMaskAndPlaceholder(country: CountryPhoneFormatDto): void {
    const { mask, placeholder } = this.getCountryMaskAndPlaceholder(country);
    this.mask$.next(mask);
    this.placeholder$.next(placeholder);
  }

  private getCountryMaskAndPlaceholder(country: CountryPhoneFormatDto): {
    mask: string;
    placeholder: string;
  } {
    const defaultValue = ''.padStart(country.phone_body_length, 'X');
    return (
      COUNTRY_PHONE_PROPS[country.country_code] || {
        mask: defaultValue,
        placeholder: defaultValue,
      }
    );
  }

  private groupCountries(): void {
    const popular = this.countryPhoneFormats
      .filter(({ country_code }) => POPULAR_COUNTRIES.includes(country_code))
      .reverse();
    const regular = this.countryPhoneFormats.filter(({ country_code }) => !POPULAR_COUNTRIES.includes(country_code));
    this.groupedCountries = { popular, regular };
  }

  private filterCountries(countries: CountryPhoneFormatDto[], filterValue: string): CountryPhoneFormatDto[] {
    return countries
      .filter(
        ({ country_code }) =>
          country_code.toLowerCase().includes(filterValue.toLowerCase()) ||
          this.translations[country_code].toLowerCase().includes(filterValue.toLowerCase()),
      )
      .sort(
        (a, b) =>
          POPULAR_COUNTRY_ORDER[a.country_code as AccountCountry] -
          POPULAR_COUNTRY_ORDER[b.country_code as AccountCountry],
      );
  }
}
