import { Injectable, NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PaymentType } from '@constant';
import { FeeType, FleetVehicleDriverType } from '@data-access';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';

@Injectable()
class IconsConfigService implements IconsConfig {
  public back = 'i-back';
  public next = 'i-next';
  public logo = 'i-logo';
  public star = 'i-star';
  public karma = 'i-karma';
  public link = 'i-link';
  public unlink = 'i-unlink';
  public linkRounded = 'i-link-rounded';
  public info = 'i-info';
  public plus = 'i-plus';
  public checkWhite = 'i-check-white';
  public checkGreen = 'i-check-green';
  public closeRed = 'i-close-red';
  public stickyTableActive = 'i-sticky-table-active';
  public stickyTableInactive = 'i-sticky-table-inactive';
  public plusLight = 'i-plus-light';
  public deleteRed = 'i-delete-red';
  public visa = 'i-visa';
  public mastercard = 'i-mastercard';
  public financePositive = 'i-finance-positive';
  public financeNegative = 'i-finance-negative';
  public financeNeutral = 'i-finance-neutral';
  public multiPointAddress = 'i-multi-point-address';
  public multiAddress = 'i-multi-address';
  public multiAddressFull = 'i-multi-address-full';
  public address = 'i-address';
  public cashBase = 'i-cash-base';
  public paymentApple = `i-${PaymentType.APPLE}`;
  public paymentCard = `i-${PaymentType.CARD}`;
  public paymentCash = `i-${PaymentType.CASH}`;
  public paymentCorporateWallet = `i-${PaymentType.CORPORATE_WALLET}`;
  public paymentGoogle = `i-${PaymentType.GOOGLE}`;
  public paymentTerminal = `i-${PaymentType.TERMINAL}`;
  public paymentUWallet = `i-${PaymentType.UWALLET}`;
  public feeTypeCash = `i-fee-type-${FeeType.CASH}`;
  public feeTypeCashless = `i-fee-type-${FeeType.CASHLESS}`;
  public feeTypeMixed = `i-fee-type-${FeeType.MIXED}`;
  public close = 'i-close';
  public filterWhite = 'i-filter-white';
  public filterBlack = 'i-filter-black';
  public search = 'i-search';
  public delete = 'i-delete';
  public arrow = 'i-arrow';
  public arrowRight = 'i-arrow-right';
  public arrowRightSm = 'i-arrow-right-sm';
  public arrowCustomFill = 'i-arrow-custom-fill';
  public check = 'i-check';
  public checkCircle = 'i-check-circle';
  public copy = 'i-copy';
  public copyBlack = 'i-copy-black';
  public copyMobile = 'i-copy-mobile';
  public exit = 'i-exit';
  public personSuccess = 'i-person-success';
  public personError = 'i-person-error';
  public cancelSuccess = 'i-cancel-success';
  public cancelError = 'i-cancel-error';
  public infoLight = 'i-info-light';
  public infoLightDynColor = 'i-info-dyncolor';
  public linkGrey = 'i-link-grey';
  public linkGreyActive = 'i-link-grey-active';
  public linkBig = 'i-link-big';
  public menuOpened = 'i-menu-opened';
  public menuClosed = 'i-menu-closed';
  public bonusWhite = 'i-bonus-white';
  public contactsWhite = 'i-contacts-white';
  public driversWhite = 'i-drivers-white';
  public financeWhite = 'i-finance-white';
  public generalWhite = 'i-general-white';
  public ordersWhite = 'i-orders-white';
  public ratingWhite = 'i-rating-white';
  public vehiclesWhite = 'i-vehicles-white';
  public nextGreen = 'i-next-green';
  public econom = 'i-econom';
  public standard = 'i-standard';
  public comfort = 'i-comfort';
  public business = 'i-business';
  public vehicleAvatar = 'i-vehicle-avatar';
  public warning = 'i-warning';
  public removeWallet = 'i-remove-wallet';
  public csv = 'i-csv';
  public vehicleAvailabilityTypeAll = `i-availability-${FleetVehicleDriverType.ALL}`;
  public vehicleAvailabilityTypeSpecificDrivers = `i-availability-${FleetVehicleDriverType.SPECIFIC_DRIVERS}`;
  public vehicleAvailabilityTypeNobody = `i-availability-${FleetVehicleDriverType.NOBODY}`;
  public vehicleCargoSmall = 'icon-vehicle-cargo-small';
  public vehicleCargoMedium = 'icon-vehicle-cargo-medium';
  public vehicleCargoLarge = 'icon-vehicle-cargo-large';
  public cameraGray = 'i-camera-gray';
  public cameraGreen = 'i-camera-green';
  public docGreen = 'i-doc-green';
  public hand = 'i-hand';
  public branded = 'i-branded';
  public brandedEmpty = 'i-branded-empty';
  public brandedInactive = 'i-branded-inactive';
  public branderWithPriority = 'i-branded-with-priority';
  public branderPriorityDisabled = 'i-branded-priority-disabled';
  public priority = 'i-priority';
  public circleProcess = 'i-circle-process';
  public circleCompleted = 'i-circle-completed';
  public circleCompletedInactive = 'i-circle-completed-inactive';
  public circleNext = 'i-circle-next';
  public chargeBalance = 'i-charge-balance';
  public expandCircle = 'i-expand-circle';
  public notificationBlock = 'i-notification-block';
  public notificationCar = 'i-notification-car';
  public notificationCarDelete = 'i-notification-car-delete';
  public notificationContact = 'i-notification-contact';
  public notificationContactDelete = 'i-notification-contact-delete';
  public notificationDriver = 'i-notification-driver';
  public notificationDriverDelete = 'i-notification-driver-delete';
  public notificationFeedback = 'i-notification-feedback';
  public notificationPhotoControl = 'i-notification-photo-control';
  public notificationTicket = 'i-notification-ticket';
  public notificationInfo = 'i-notification-info';
  public notificationB2B = 'i-notification-b2b';
  public progressActivity = 'i-progress-activity';
  public docInfo = 'i-doc-info';
  public telegram = 'i-telegram';
  public viber = 'i-viber';
  public comment = 'i-comment';
  public upload = 'i-upload';
  public withdrawalWallet = 'i-withdrawal-wallet';
  public topUpUser = 'i-top-up-user';
  public checklist = 'i-checklist';
  public dashboard = 'i-dashboard';
  public drivers = 'i-drivers';
  public vehicles = 'i-vehicles';
  public map = 'i-map';
  public orders = 'i-orders';
  public finance = 'i-finance';
  public bonuses = 'i-bonuses';
  public feedbacks = 'i-feedbacks';
  public fleetProfile = 'i-fleet-profile';
  public preferences = 'i-preferences';
  public contacts = 'i-contacts';
  public verticalDots = 'i-vertical-dots';
  public deleteBase = 'i-delete-base';
  public person = 'i-person';

  constructor(
    private readonly registry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
  ) {
    [
      { alias: this.notificationBlock, path: 'assets/icons/icon-notification-block.svg' },
      { alias: this.notificationInfo, path: 'assets/icons/icon-notification-info.svg' },
      { alias: this.notificationCar, path: 'assets/icons/icon-notification-car.svg' },
      { alias: this.notificationCarDelete, path: 'assets/icons/icon-notification-car-delete.svg' },
      { alias: this.notificationContact, path: 'assets/icons/icon-notification-contact.svg' },
      {
        alias: this.notificationContactDelete,
        path: 'assets/icons/icon-notification-contact-delete.svg',
      },
      { alias: this.notificationDriver, path: 'assets/icons/icon-notification-driver.svg' },
      { alias: this.notificationDriverDelete, path: 'assets/icons/icon-notification-driver-delete.svg' },
      { alias: this.notificationFeedback, path: 'assets/icons/icon-notification-feedback.svg' },
      { alias: this.notificationPhotoControl, path: 'assets/icons/icon-notification-photo-control.svg' },
      { alias: this.notificationTicket, path: 'assets/icons/icon-notification-ticket.svg' },
      { alias: this.notificationB2B, path: 'assets/icons/icon-notification-b2b.svg' },
      { alias: this.back, path: 'assets/icons/icon_arrow_left.svg' },
      { alias: this.next, path: 'assets/icons/icon_arrow_small_right.svg' },
      { alias: this.logo, path: 'assets/icons/uklon-logo.svg' },
      { alias: this.star, path: 'assets/icons/icon-star.svg' },
      { alias: this.karma, path: 'assets/icons/icon_karma.svg' },
      { alias: this.link, path: 'assets/icons/icon_link.svg' },
      { alias: this.unlink, path: 'assets/icons/icon_unlink.svg' },
      { alias: this.linkRounded, path: 'assets/icons/icon_link_rounded.svg' },
      { alias: this.info, path: 'assets/icons/icon_info.svg' },
      { alias: this.plus, path: 'assets/icons/icon_plus.svg' },
      { alias: this.checkWhite, path: 'assets/icons/icon_check_white.svg' },
      { alias: this.checkGreen, path: 'assets/icons/icon_check_green.svg' },
      { alias: this.closeRed, path: 'assets/icons/icon_close_red.svg' },
      { alias: this.stickyTableActive, path: 'assets/icons/icon_sticky_table_active.svg' },
      { alias: this.stickyTableInactive, path: 'assets/icons/icon_sticky_table_inactive.svg' },
      { alias: this.plusLight, path: 'assets/icons/icon_plus-light.svg' },
      { alias: this.deleteRed, path: 'assets/icons/icon_delete-red.svg' },
      { alias: this.visa, path: 'assets/icons/icon_visa.svg' },
      { alias: this.mastercard, path: 'assets/icons/icon_mastercard.svg' },
      { alias: this.financePositive, path: 'assets/icons/icon_finance-positive.svg' },
      { alias: this.financeNegative, path: 'assets/icons/icon_finance-negative.svg' },
      { alias: this.financeNeutral, path: 'assets/icons/icon_finance-neutral.svg' },
      { alias: this.multiPointAddress, path: 'assets/icons/icon_address_multipoint.svg' },
      { alias: this.multiAddress, path: 'assets/icons/icon_multi_address.svg' },
      { alias: this.multiAddressFull, path: 'assets/icons/icon_multi_address_full.svg' },
      { alias: this.address, path: 'assets/icons/icon_address.svg' },
      { alias: this.cashBase, path: 'assets/icons/icon-cash-base.svg' },
      { alias: this.paymentApple, path: 'assets/icons/icon_apple_pay.svg' },
      { alias: this.paymentCard, path: 'assets/icons/icon_card.svg' },
      { alias: this.paymentCash, path: 'assets/icons/icon_cash.svg' },
      { alias: this.paymentCorporateWallet, path: 'assets/icons/icon_card.svg' },
      { alias: this.paymentGoogle, path: 'assets/icons/icon_google_pay.svg' },
      { alias: this.paymentTerminal, path: 'assets/icons/icon_card.svg' },
      { alias: this.paymentUWallet, path: 'assets/icons/icon_card.svg' },
      { alias: this.feeTypeCash, path: 'assets/icons/icon_cash.svg' },
      { alias: this.feeTypeCashless, path: 'assets/icons/icon_card.svg' },
      { alias: this.feeTypeMixed, path: 'assets/icons/icon_wallet.svg' },
      { alias: this.close, path: 'assets/icons/icon_close.svg' },
      { alias: this.filterWhite, path: 'assets/icons/icon_filter_white.svg' },
      { alias: this.filterBlack, path: 'assets/icons/icon_filter_black.svg' },
      { alias: this.search, path: 'assets/icons/icon_search.svg' },
      { alias: this.delete, path: 'assets/icons/icon_delete.svg' },
      { alias: this.arrow, path: 'assets/icons/icon_arrow_small_down.svg' },
      { alias: this.arrowCustomFill, path: 'assets/icons/icon_arrow_small_down_custom_fill.svg' },
      { alias: this.arrow, path: 'assets/icons/icon_arrow_small_down.svg' },
      { alias: this.arrowRight, path: 'assets/icons/icon_arrow_right.svg' },
      { alias: this.arrowRightSm, path: 'assets/icons/icon_arrow_right_sm.svg' },
      { alias: this.check, path: 'assets/icons/icon_check_grey.svg' },
      { alias: this.checkCircle, path: 'assets/icons/icon-check-circle.svg' },
      { alias: this.copy, path: 'assets/icons/icon_copy.svg' },
      { alias: this.copyBlack, path: 'assets/icons/icon_copy_black.svg' },
      { alias: this.copyMobile, path: 'assets/icons/icon_copy_mobile.svg' },
      { alias: this.exit, path: 'assets/icons/icon_exit.svg' },
      { alias: this.personSuccess, path: 'assets/icons/icon_person-green.svg' },
      { alias: this.personError, path: 'assets/icons/icon_person-red.svg' },
      { alias: this.cancelSuccess, path: 'assets/icons/icon_cancel-green.svg' },
      { alias: this.cancelError, path: 'assets/icons/icon_cancel-red.svg' },
      { alias: this.infoLight, path: 'assets/icons/icon_info-light.svg' },
      { alias: this.infoLightDynColor, path: 'assets/icons/icon_info-dyncolor.svg' },
      { alias: this.linkGrey, path: 'assets/icons/icon_link-grey.svg' },
      { alias: this.linkGreyActive, path: 'assets/icons/icon_link-grey-active.svg' },
      { alias: this.linkBig, path: 'assets/icons/icon_link-big.svg' },
      { alias: this.menuOpened, path: 'assets/icons/icon_menu_opened.svg' },
      { alias: this.menuClosed, path: 'assets/icons/icon_menu_closed.svg' },
      { alias: this.bonusWhite, path: 'assets/icons/icon_bonus_white.svg' },
      { alias: this.contactsWhite, path: 'assets/icons/icon_contacts_white.svg' },
      { alias: this.driversWhite, path: 'assets/icons/icon_drivers_white.svg' },
      { alias: this.financeWhite, path: 'assets/icons/icon_finance_white.svg' },
      { alias: this.generalWhite, path: 'assets/icons/icon_general_white.svg' },
      { alias: this.ordersWhite, path: 'assets/icons/icon_orders_white.svg' },
      { alias: this.ratingWhite, path: 'assets/icons/icon_rating_white.svg' },
      { alias: this.vehiclesWhite, path: 'assets/icons/icon_vehicles_white.svg' },
      { alias: this.econom, path: 'assets/icons/icon_econom.svg' },
      { alias: this.standard, path: 'assets/icons/icon_standard.svg' },
      { alias: this.comfort, path: 'assets/icons/icon_comfort.svg' },
      { alias: this.business, path: 'assets/icons/icon_business.svg' },
      { alias: this.nextGreen, path: 'assets/icons/icon_arrow_small_right_green.svg' },
      { alias: this.vehicleAvatar, path: 'assets/icons/icon_vehicle_avatar.svg' },
      { alias: this.warning, path: 'assets/icons/icon-warning.svg' },
      { alias: this.csv, path: 'assets/icons/icon-csv.svg' },
      { alias: this.removeWallet, path: 'assets/icons/icon-remove-wallet.svg' },
      { alias: this.vehicleAvailabilityTypeAll, path: 'assets/icons/icon-vehicle-availability-all.svg' },
      {
        alias: this.vehicleAvailabilityTypeSpecificDrivers,
        path: 'assets/icons/icon-vehicle-availability-specific-drivers.svg',
      },
      { alias: this.vehicleAvailabilityTypeNobody, path: 'assets/icons/icon-vehicle-availability-nobody.svg' },
      { alias: this.vehicleCargoSmall, path: 'assets/icons/icon-vehicle-cargo-small.svg' },
      { alias: this.vehicleCargoMedium, path: 'assets/icons/icon-vehicle-cargo-medium.svg' },
      { alias: this.vehicleCargoLarge, path: 'assets/icons/icon-vehicle-cargo-large.svg' },
      { alias: this.cameraGray, path: 'assets/icons/icon_camera_gray.svg' },
      { alias: this.cameraGreen, path: 'assets/icons/icon_camera_green.svg' },
      { alias: this.docGreen, path: 'assets/icons/icon_doc_green.svg' },
      { alias: this.hand, path: 'assets/icons/icon_hand.svg' },
      { alias: this.branded, path: 'assets/icons/icon-branded.svg' },
      { alias: this.brandedEmpty, path: 'assets/icons/icon-branded-empty.svg' },
      { alias: this.brandedInactive, path: 'assets/icons/icon-branded-inactive.svg' },
      { alias: this.branderWithPriority, path: 'assets/icons/icon-branded-with-priority.svg' },
      { alias: this.branderPriorityDisabled, path: 'assets/icons/icon-branded-priority-disabled.svg' },
      { alias: this.priority, path: 'assets/icons/icon-priority.svg' },
      { alias: this.circleProcess, path: 'assets/icons/icon-process.svg' },
      { alias: this.circleCompleted, path: 'assets/icons/icon-completed.svg' },
      { alias: this.circleCompletedInactive, path: 'assets/icons/icon-completed-inactive.svg' },
      { alias: this.circleNext, path: 'assets/icons/icon-next.svg' },
      { alias: this.chargeBalance, path: 'assets/icons/icon-charge-balance.svg' },
      { alias: this.expandCircle, path: 'assets/icons/icon-expand-circle.svg' },
      { alias: this.progressActivity, path: 'assets/icons/icon-progress-activity.svg' },
      { alias: this.docInfo, path: 'assets/icons/icon-doc-info.svg' },
      { alias: this.telegram, path: 'assets/icons/icon-telegram.svg' },
      { alias: this.viber, path: 'assets/icons/icon-viber.svg' },
      { alias: this.comment, path: 'assets/icons/icon-comment.svg' },
      { alias: this.upload, path: 'assets/icons/icon-upload.svg' },
      { alias: this.withdrawalWallet, path: 'assets/icons/icon_withdrawal_wallet.svg' },
      { alias: this.topUpUser, path: 'assets/icons/icon_top_up_user.svg' },
      { alias: this.checklist, path: 'assets/icons/sidebar/icon_checklist.svg' },
      { alias: this.dashboard, path: 'assets/icons/sidebar/icon_dashboard.svg' },
      { alias: this.drivers, path: 'assets/icons/sidebar/icon_drivers.svg' },
      { alias: this.vehicles, path: 'assets/icons/sidebar/icon_vehicle.svg' },
      { alias: this.map, path: 'assets/icons/sidebar/icon_map.svg' },
      { alias: this.orders, path: 'assets/icons/sidebar/icon_orders.svg' },
      { alias: this.finance, path: 'assets/icons/sidebar/icon_finance.svg' },
      { alias: this.bonuses, path: 'assets/icons/sidebar/icon_verified.svg' },
      { alias: this.feedbacks, path: 'assets/icons/sidebar/icon_star.svg' },
      { alias: this.fleetProfile, path: 'assets/icons/sidebar/icon_fleet_profile.svg' },
      { alias: this.preferences, path: 'assets/icons/sidebar/icon_tune.svg' },
      { alias: this.contacts, path: 'assets/icons/sidebar/icon_contact.svg' },
      { alias: this.verticalDots, path: 'assets/icons/icon_vertical_dots.svg' },
      { alias: this.deleteBase, path: 'assets/icons/icon_delete_base.svg' },
      { alias: this.person, path: 'assets/icons/icon_person.svg' },
    ].forEach((item) => this.registry.addSvgIcon(item.alias, this.sanitizer.bypassSecurityTrustResourceUrl(item.path)));
  }
}

@NgModule({
  providers: [
    {
      provide: ICONS,
      useClass: IconsConfigService,
      deps: [MatIconRegistry, DomSanitizer],
    },
  ],
})
export class IconsModule {}
