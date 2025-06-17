export enum FleetAnalyticsEventType {
  NONE = '',
  /**
   * @analytic login_screen
   * @example {ip: string, user_agent: string}
   */
  LOGIN_SCREEN = 'login_screen',
  /**
   * @analytic login_continue
   * @example {ip: string, user_agent: string}
   */
  LOGIN_CONTINUE = 'login_continue',
  /**
   * @analytic login_remember_me
   * @example {ip: string, user_agent: string}
   */
  LOGIN_REMEMBER_ME = 'login_remember_me',
  /**
   * @analytic login_phone_input_correct
   * @example {ip: string, user_agent: string, phone: string}
   */
  LOGIN_PHONE_INPUT_CORRECT = 'login_phone_input_correct',
  /**
   * @analytic login_password_input_correct
   * @example {ip: string, user_agent: string}
   */
  LOGIN_PASSWORD_INPUT_CORRECT = 'login_password_input_correct',
  /**
   * @analytic login_phone_input_incorrect
   * @example {ip: string, user_agent: string, error_code: number, error_text: string, phone: string}
   */
  LOGIN_PHONE_INPUT_INCORRECT = 'login_phone_input_incorrect',
  /**
   * @analytic login_code_input_page
   * @example {ip: string, user_agent: string, phone: string}
   */
  LOGIN_ACCESS_DENIED_SCREEN = 'login_access_denied_screen',
  /**
   * @analytic login_privacy_policy_link
   * @example {ip: string, user_agent: string}
   */
  LOGIN_PRIVACY_POLICY_LINK = 'login_privacy_policy_link',
  /**
   * @analytic login_support_widget
   * @example {ip: string, user_agent: string}
   */
  LOGIN_SUPPORT_WIDGET = 'login_support_widget',
  /**
   * @analytic login_apply_for_account

   * @example {ip: string, user_agent: string}
   */
  LOGIN_APPLY_FOR_ACCOUNT = 'login_apply_for_account',
  /**
   * @analytic forgot_password
   * @example {ip: string, user_agent: string}
   */
  FORGOT_PASSWORD = 'forgot_password',
  /**
   * @analytic reset_password_dialog_close_icon
   * @example {ip: string, user_agent: string}
   */
  RESET_PASSWORD_DIALOG_CLOSE_ICON = 'reset_password_dialog_close_icon',
  /**
   * @analytic reset_password_dialog_close
   * @example {ip: string, user_agent: string}
   */
  RESET_PASSWORD_DIALOG_CLOSE = 'reset_password_dialog_close',
  /**
   * @analytic reset_password_dialog_confirm
   * @example {ip: string, user_agent: string}
   */
  RESET_PASSWORD_DIALOG_CONFIRM = 'reset_password_dialog_confirm',
  /**
   * @analytic forgot_password_phone_input_correct
   * @example {ip: string, user_agent: string}
   */
  DASHBOARD_SCREEN = 'dashboard_screen',
  /**
   * @analytic drivers_list_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  DRIVERS_LIST_SCREEN = 'drivers_list_screen',
  /**
   * @analytic drivers_tickets_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  DRIVERS_TICKETS_SCREEN = 'drivers_tickets_screen',
  /**
   * @analytic drivers_photo_control_list_screen
   * @example {fleet_id: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string}
   */
  DRIVERS_PHOTO_CONTROL_LIST_SCREEN = 'drivers_photo_control_list_screen',
  /**
   * @analytic driver_photo_control_period_filter
   * @example {start_date: number: end_date: number, fleet_id: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string}
   */
  DRIVER_PHOTO_CONTROL_PERIOD_FILTER = 'driver_photo_control_period_filter',
  /**
   * @analytic driver_photo_control_filter
   * @example {filter: string, filter_value: number, fleet_id: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string}
   */
  DRIVER_PHOTO_CONTROL_FILTER = 'driver_photo_control_filter',
  /**
   * @analytic driver_photo_control_filter_clear
   * @example {fleet_id: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string}
   */
  DRIVER_PHOTO_CONTROL_FILTER_CLEAR = 'driver_photo_control_filter_clear',
  /**
   * @analytic driver_photo_control_click_to_ticket
   * @example {ticket_id: string, fleet_id: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string}
   */
  DRIVER_PHOTO_CONTROL_CLICK_TO_TICKET = 'driver_photo_control_click_to_ticket',
  /**
   * @analytic drivers_driver_detail_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', driver_id: string, fleet_id: string}
   */
  DRIVERS_DRIVER_DETAIL_SCREEN = 'drivers_driver_detail_screen',
  /**
   * @analytic drivers_delete_driver
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', driver_id: string, fleet_id: string}
   */
  DRIVERS_DELETE_DRIVER = 'drivers_delete_driver',
  /**
   * @analytic drivers_delete_driver_confirmed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', driver_id: string, reason: string, comment: string, fleet_id: string}
   */
  DRIVERS_DELETE_DRIVER_CONFIRMED = 'drivers_delete_driver_confirmed',
  /**
   * @analytic drivers_karma_opened
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', driver_id: string, fleet_id: string}
   */
  DRIVERS_KARMA_OPENED = 'drivers_karma_opened',
  /**
   * @analytic drivers_karma_link_clicked
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', driver_id: string, fleet_id: string}
   */
  DRIVERS_KARMA_LINK_CLICKED = 'drivers_karma_link_clicked',
  /**
   * @analytic driver_details_navigate_to_photo_control
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', ticket_id: string, fleet_id: string}
   */
  DRIVER_DETAILS_NAVIGATE_TO_PHOTO_CONTROL = 'driver_details_navigate_to_photo_control',
  /**
   * @analytic driver_navigate_to_photo_control_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', ticket_id: string, page: string, fleet_id: string}
   */
  DRIVER_PHOTO_CONTROL_SCREEN = 'driver_photo_control_screen',
  /**
   * @analytic driver_photo_control_img_upload
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string, fleet_id: string, ticket_id: string, ticket_status: boolean, img_type: string}
   */
  DRIVER_PHOTO_CONTROL_IMG_CLICK = 'driver_photo_control_img_click',
  /**
   * @analytic driver_photo_control_img_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string, fleet_id: string, ticket_id: string, ticket_status: boolean, img_type: string}
   */
  DRIVER_PHOTO_CONTROL_IMG_UPLOADED = 'driver_photo_control_img_uploaded',
  /**
   * @analytic driver_photo_control_ticket_send
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string, fleet_id: string, ticket_id: string, ticket_status: boolean, img_type: string}
   */
  DRIVER_PHOTO_CONTROL_TICKET_SEND = 'driver_photo_control_ticket_send',
  /**
   * @analytic vehicles_list_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  VEHICLES_LIST_SCREEN = 'vehicles_list_screen',
  /**
   * @analytic vehicles_requests_list_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  VEHICLES_REQUESTS_LIST_SCREEN = 'vehicles_requests_list_screen',
  /**
   * @analytic vehicles_license_plate_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', licence_plate: string, fleet_id: string}
   */
  VEHICLES_LICENSE_PLATE_FILTER = 'vehicles_license_plate_filter',
  /**
   * @analytic vehicles_priority_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', priority: boolean, fleet_id: string}
   */
  VEHICLES_PRIORITY_FILTER = 'vehicles_priority_filter',
  /**
   * @analytic vehicles_branding_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', branding: boolean, fleet_id: string}
   */
  VEHICLES_BRANDING_FILTER = 'vehicles_branding_filter',
  /**
   * @analytic vehicles_body_type_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', bodyType: string, fleet_id: string}
   */
  VEHICLES_BODY_TYPE_FILTER = 'vehicles_body_type_filter',
  /**
   * @analytic vehicles_status_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', status: 'Active' | 'Blocked' | 'All', fleet_id: string}
   */
  VEHICLES_STATUS_FILTER = 'vehicles_status_filter',
  /**
   * @analytic vehicles_add_vehicle
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', 'fleet_id': string }
   */
  VEHICLES_ADD_VEHICLE = 'vehicles_add_vehicle',
  /**
   * @analytic vehicles_unlink_vehicle
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', driver_id: string, vehicle_id: string, fleet_id: string}
   */
  VEHICLES_UNLINK_VEHICLE = 'vehicles_unlink_vehicle',
  /**
   * @analytic vehicles_unlink_vehicle_confirmed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', driver_id: string, vehicle_id: string, fleet_id: string}
   */
  VEHICLES_UNLINK_VEHICLE_CONFIRMED = 'vehicles_unlink_vehicle_confirmed',
  /**
   * @analytic vehicles_unlink_vehicle_canceled
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', driver_id: string, vehicle_id: string, fleet_id: string}
   */
  VEHICLES_UNLINK_VEHICLE_CANCELED = 'vehicles_unlink_vehicle_canceled',
  /**
   * @analytic vehicles_tickets_add_vehicle
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  VEHICLES_TICKETS_ADD_VEHICLE = 'vehicles_tickets_add_vehicle',
  /**
   * @analytic vehicles_tickets_delete_ticket
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', ticket_id: string, fleet_id: string}
   */
  VEHICLES_TICKETS_DELETE_TICKET = 'vehicles_tickets_delete_ticket',
  /**
   * @analytic vehicles_tickets_delete_ticket_confirmed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', ticket_id: string, fleet_id: string}
   */
  VEHICLES_TICKETS_DELETE_TICKET_CONFIRMED = 'vehicles_tickets_delete_ticket_confirmed',
  /**
   * @analytic vehicles_tickets_delete_ticket_canceled
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', ticket_id: string, fleet_id: string}
   */
  VEHICLES_TICKETS_DELETE_TICKET_CANCELED = 'vehicles_tickets_delete_ticket_canceled',
  /**
   * @analytic vehicles_tickets_license_plate_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', licence_plate: string, fleet_id: string}
   */
  VEHICLES_TICKETS_LICENSE_PLATE_FILTER = 'vehicles_tickets_license_plate_filter',
  /**
   * @analytic vehicles_tickets_status_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', status: string, fleet_id: string}
   */
  VEHICLES_TICKETS_STATUS_FILTER = 'vehicles_tickets_status_filter',
  /**
   * @analytic vehicles_adding_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string, ticket_id: string }
   */
  VEHICLES_ADDING_SCREEN = 'vehicles_adding_screen',
  /**
   * @analytic vehicles_adding_screen_back
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  VEHICLES_ADDING_SCREEN_BACK = 'vehicles_adding_screen_back',
  /**
   * @analytic vehicles_adding_screen_continue
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  VEHICLES_ADDING_SCREEN_CONTINUE = 'vehicles_adding_screen_continue',
  /**
   * @analytic vehicles_adding_screen_send
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', vehicleFields: Record<string, unknown>, fleet_id: string, ticket_id: string, ticket_status: TicketStatus}
   */
  VEHICLES_ADDING_SCREEN_SEND = 'vehicles_adding_screen_send',
  /**
   * @analytic vehicles_adding_screen_ticket_created
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', vehicleFields: Record<string, unknown>, fleet_id: string, ticket_id: string, ticket_status: TicketStatus}
   */
  VEHICLES_ADDING_SCREEN_TICKET_CREATED = 'vehicles_adding_screen_ticket_created',
  /**
   * @analytic vehicles_adding_field_focused
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', field: string, fleet_id: string}
   */
  VEHICLES_ADDING_FIELD_FOCUSED = 'vehicles_adding_field_focused',
  /**
   * @analytic vehicles_adding_field_unfocused
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string, field: string, ticket_id: string }
   */
  VEHICLES_ADDING_FIELD_UNFOCUSED = 'vehicles_adding_field_unfocused',
  /**
   * @analytic vehicles_adding_photo_placeholder_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string, img_type: string, ticket_id: string, ticket_status: TicketStatus }
   */
  VEHICLES_ADDING_PHOTO_PLACEHOLDER_CLICK = 'vehicles_adding_photo_placeholder_click',
  /**
   * @analytic vehicles_adding_photo_uploaded
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string, img_type: string, ticket_id: string, ticket_status: TicketStatus, error: unknown }
   */
  VEHICLES_ADDING_PHOTO_UPLOADED = 'vehicles_adding_photo_uploaded',
  /**
   * @analytic order_report_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  ORDER_REPORT_SCREEN = 'order_report_screen',
  /**
   * @analytic order_report_date_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', start_date: number, end_date: number, fleet_id: string}
   */
  ORDER_REPORT_DATE_FILTER = 'order_report_date_filter',
  /**
   * @analytic order_report_driver_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', driver_id: string, fleet_id: string}
   */
  ORDER_REPORT_DRIVER_FILTER = 'order_report_driver_filter',
  /**
   * @analytic order_report_export_csv
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  ORDER_REPORT_EXPORT_CSV = 'order_report_export_csv',
  /**
   * @analytic order_trips_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  ORDER_TRIPS_SCREEN = 'order_trips_screen',
  /**
   * @analytic order_trips_filters
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', licence_plate: string,
   driver_id: string,
   start_date: number,
   end_date: number,
   product_type: string,
   status_type: status,
   fleet_id: string}
   */
  ORDER_TRIPS_FILTERS = 'order_trips_filters',
  /**
   * @analytic order_details_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  ORDER_DETAILS_SCREEN = 'order_details_screen',
  /**
   * @analytic orders_navigate_to_order
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  ORDERS_NAVIGATE_TO_ORDER = 'orders_navigate_to_order',
  /**
   * @analytic orders_apply_filters
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  ORDERS_APPLY_FILTERS = 'orders_apply_filters',
  /**
   * @analytic finance_fleet_wallet_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_SCREEN = 'finance_fleet_wallet_screen',
  /**
   * @analytic finance_fleet_wallet_date_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', start_date: number, end_date: number, fleet_id: string}
   */
  FINANCE_FLEET_WALLET_DATE_FILTER = 'finance_fleet_wallet_date_filter',
  /**
   * @analytic finance_fleet_wallet_add_card_tap
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_ADD_CARD_TAP = 'finance_fleet_wallet_add_card_tap',
  /**
   * @analytic finance_fleet_wallet_add_card_popup
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_ADD_CARD_POPUP = 'finance_fleet_wallet_add_card_popup',
  /**
   * @analytic finance_fleet_wallet_add_card_popup_closed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_ADD_CARD_POPUP_CLOSED = 'finance_fleet_wallet_add_card_popup_closed',
  /**
   * @analytic finance_fleet_wallet_add_card_popup_filled
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_ADD_CARD_POPUP_FILLED = 'finance_fleet_wallet_add_card_popup_filled',
  /**
   * @analytic finance_fleet_wallet_add_card_popup_add_tap
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_ADD_CARD_POPUP_ADD_TAP = 'finance_fleet_wallet_add_card_popup_add_tap',
  /**
   * @analytic finance_fleet_wallet_add_card_input_code_popup
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_ADD_CARD_INPUT_CODE_POPUP = 'finance_fleet_wallet_add_card_input_code_popup',
  /**
   * @analytic finance_fleet_wallet_resend_phone_code_confirmation
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', iteration_number: number, fleet_id: string}
   */
  FINANCE_FLEET_WALLET_RESEND_PHONE_CODE_CONFIRMATION = 'finance_fleet_wallet_resend_phone_code_confirmation',
  /**
   * @analytic finance_fleet_wallet_add_card_input_code_error_popup
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', error_code: number, error_text: string, fleet_id: string}
   */
  FINANCE_FLEET_WALLET_ADD_CARD_INPUT_CODE_ERROR_POPUP = 'finance_fleet_wallet_add_card_input_code_error_popup',
  /**
   * @analytic finance_fleet_wallet_add_card_continue_button
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', iteration_number: number, fleet_id: string}
   */
  FINANCE_FLEET_WALLET_ADD_CARD_CONTINUE_BUTTON = 'finance_fleet_wallet_add_card_continue_button',
  /**
   * @analytic finance_fleet_wallet_add_card_successful
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_ADD_CARD_SUCCESSFUL = 'finance_fleet_wallet_add_card_successful',
  /**
   * @analytic finance_fleet_wallet_remove_card_popup_cancel
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_REMOVE_CARD_POPUP_CANCEL = 'finance_fleet_wallet_remove_card_popup_cancel',
  /**
   * @analytic finance_fleet_wallet_remove_card_error
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', error_code: number, error_text: string, fleet_id: string}
   */
  FINANCE_FLEET_WALLET_REMOVE_CARD_ERROR = 'finance_fleet_wallet_remove_card_error',
  /**
   * @analytic finance_fleet_wallet_remove_card_successfull
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_REMOVE_CARD_SUCCESSFULL = 'finance_fleet_wallet_remove_card_successfull',
  /**
   * @analytic finance_fleet_wallet_withdraw_money_popup
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_WITHDRAW_MONEY_POPUP = 'finance_fleet_wallet_withdraw_money_popup',
  /**
   * @analytic finance_fleet_wallet_withdraw_money_close_popup
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_WITHDRAW_MONEY_CLOSE_POPUP = 'finance_fleet_wallet_withdraw_money_close_popup',
  /**
   * @analytic finance_fleet_wallet_withdraw_money_successful
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_WITHDRAW_MONEY_SUCCESSFUL = 'finance_fleet_wallet_withdraw_money_successful',
  /**
   * @analytic finance_fleet_wallet_withdraw_money_error
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', error_code: number, error_text: string, fleet_id: string}
   */
  FINANCE_FLEET_WALLET_WITHDRAW_MONEY_ERROR = 'finance_fleet_wallet_withdraw_money_error',
  /**
   * @analytic finance_fleet_wallet_withdraw_money_popup_confirm
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', withdraw_sum: number, fleet_id: string}
   */
  FINANCE_FLEET_WALLET_WITHDRAW_MONEY_POPUP_CONFIRM = 'finance_fleet_wallet_withdraw_money_popup_confirm',
  /**
   * @analytic finance_fleet_wallet_withdraw_unavailable_tap
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_FLEET_WALLET_WITHDRAW_UNAVAILABLE_TAP = 'finance_fleet_wallet_withdraw_unavailable_tap',
  /**
   * @analytic finance_driver_balances_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_SCREEN = 'finance_driver_balances_screen',
  /**
   * @analytic driver_transactions_balances_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  DRIVER_TRANSACTIONS_BALANCES_SCREEN = 'driver_transactions_balances_screen',
  /**
   * @analytic finance_driver_balances_name_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', name: string, fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_NAME_FILTER = 'finance_driver_balances_name_filter',
  /**
   * @analytic finance_driver_balances_phone_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', phone: string, fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_PHONE_FILTER = 'finance_driver_balances_phone_filter',
  /**
   * @analytic finance_driver_balances_withdraw_all_checkbox
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_WITHDRAW_ALL_CHECKBOX = 'finance_driver_balances_withdraw_all_checkbox',
  /**
   * @analytic finance_driver_balances_withdraw_all_input_sum
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', withdraw_sum: number, fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_WITHDRAW_ALL_INPUT_SUM = 'finance_driver_balances_withdraw_all_input_sum',
  /**
   * @analytic finance_driver_balances_transfer_to_wallet_tap
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_TRANSFER_TO_WALLET_TAP = 'finance_driver_balances_transfer_to_wallet_tap',
  /**
   * @analytic finance_driver_balances_transfer_to_wallet_popup
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_TRANSFER_TO_WALLET_POPUP = 'finance_driver_balances_transfer_to_wallet_popup',
  /**
   * @analytic finance_driver_balances_transfer_to_wallet_popup_confirm
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_TRANSFER_TO_WALLET_POPUP_CONFIRM = 'finance_driver_balances_transfer_to_wallet_popup_confirm',
  /**
   * @analytic finance_driver_balances_transfer_to_wallet_popup_cancel
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_TRANSFER_TO_WALLET_POPUP_CANCEL = 'finance_driver_balances_transfer_to_wallet_popup_cancel',
  /**
   * @analytic finance_driver_balances_replenish_balance_tap
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_REPLENISH_BALANCE_TAP = 'finance_driver_balances_replenish_balance_tap',
  /**
   * @analytic finance_driver_balances_replenish_balance_popup
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_REPLENISH_BALANCE_POPUP = 'finance_driver_balances_replenish_balance_popup',
  /**
   * @analytic finance_driver_balances_replenish_balancet_popup_confirm
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_REPLENISH_BALANCET_POPUP_CONFIRM = 'finance_driver_balances_replenish_balancet_popup_confirm',
  /**
   * @analytic finance_driver_balances_replenish_balance_popup_cancel
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FINANCE_DRIVER_BALANCES_REPLENISH_BALANCE_POPUP_CANCEL = 'finance_driver_balances_replenish_balance_popup_cancel',
  /**
   * @analytic driver_transactions_date_and_driver_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', start_date: number, end_date: number, driver_id: string, fleet_id: string}
   */
  DRIVER_TRANSACTIONS_DATE_AND_DRIVER_FILTER = 'driver_transactions_date_and_driver_filter',
  /**
   * @analytic driver_transactions_filters_clear
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  DRIVER_TRANSACTIONS_FILTERS_CLEAR = 'driver_transactions_filters_clear',
  /**
   * @analytic language_changed
   * @example {ip: string, user_agent: string, fleet_id: string}
   */
  LANGUAGE_CHANGED = 'language_changed',
  /**
   * @analytic phone_input_code_changed
   * @example {ip: string, user_agent: string, phone_code: string, fleet_id: string}
   */
  PHONE_INPUT_CODE_CHANGED = 'phone_input_code_changed',
  /**
   * @analytic sidebar_fleet_changed
   * @example {ip: string, user_agent: string, fleet_name: string, fleet_id: string}
   */
  SIDEBAR_FLEET_CHANGED = 'sidebar_fleet_changed',
  /**
   * @analytic live_map_screen
   * @example {ip: string, user_agent: string, fleet_id: string}
   */
  LIVE_MAP_SCREEN = 'live_map_screen',
  /**
   * @analytic live_map_drivers_group_selected
   * @example {ip: string, user_agent: string, drivers_list_status: string, fleet_id: string}
   */
  LIVE_MAP_DRIVERS_GROUP_SELECTED = 'live_map_drivers_group_selected',
  /**
   * @analytic live_map_driver_selected
   * @example {ip: string, user_agent: string, fleet_id: string}
   */
  LIVE_MAP_DRIVER_SELECTED = 'live_map_driver_selected',
  /**
   * @analytic live_map_navigate_to_driver
   * @example {ip: string, user_agent: string, link_type: 'driver', fleet_id: string}
   */
  LIVE_MAP_NAVIGATE_TO_DRIVER = 'live_map_navigate_to_driver',
  /**
   * @analytic live_map_popup_open_driver_details
   * @example {ip: string, user_agent: string, link_type: 'driver_map', fleet_id: string}
   */
  LIVE_MAP_POPUP_OPEN_DRIVER_DETAILS = 'live_map_popup_open_driver_details',
  /**
   * @analytic live_map_navigate_to_vehicle
   * @example {ip: string, user_agent: string, link_type: 'vehicle', fleet_id: string}
   */
  LIVE_MAP_NAVIGATE_TO_VEHICLE = 'live_map_navigate_to_vehicle',
  /**
   * @analytic live_map_toggle_active_order
   * @example {ip: string, user_agent: string, ride_status: string, fleet_id: string}
   */
  LIVE_MAP_TOGGLE_ACTIVE_ORDER = 'live_map_toggle_active_order',
  /**
   * @analytic live_map_drivers_search
   * @example {ip: string, user_agent: string, ride_status: string, drivers_count: number, fleet_id: string}
   */
  LIVE_MAP_DRIVERS_SEARCH = 'live_map_drivers_search',
  /**
   * @analytic live_map_search_back_btn
   * @example {ip: string, user_agent: string, fleet_id: string}
   */
  LIVE_MAP_SEARCH_BACK_BTN = 'live_map_search_back_btn',
  /**
   * @analytic live_map_focus_search_input
   * @example {ip: string, user_agent: string, search_input_name: 'name' | 'licensePlate', fleet_id: string}
   */
  LIVE_MAP_FOCUS_SEARCH_INPUT = 'live_map_focus_search_input',
  /**
   * @analytic live_map_filters_cleared
   * @example {ip: string, user_agent: string, fleet_id: string}
   */
  LIVE_MAP_FILTERS_CLEARED = 'live_map_filters_cleared',
  /**
   * @analytic live_map_toggle_panel
   * @example {ip: string, user_agent: string, view: 'opened' | 'closed', panel: string, fleet_id: string}
   */
  LIVE_MAP_TOGGLE_PANEL = 'live_map_toggle_panel',
  /**
   * @analytic live_map_toggle_full_screen
   * @example {ip: string, user_agent: string, fullScreen: 'on' | 'off', fleet_id: string}
   */
  LIVE_MAP_TOGGLE_FULL_SCREEN = 'live_map_toggle_full_screen',
  /**
   * @analytic profile_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  PROFILE_SCREEN = 'profile_screen',
  /**
   * @analytic profile_change_password_popup
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  PROFILE_CHANGE_PASSWORD_POPUP = 'profile_change_password_popup',
  /**
   * @analytic profile_change_password_popup_closed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  PROFILE_CHANGE_PASSWORD_POPUP_CLOSED = 'profile_change_password_popup_closed',
  /**
   * @analytic profile_change_password_popup_new_password_valid
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  PROFILE_CHANGE_PASSWORD_POPUP_NEW_PASSWORD_VALID = 'profile_change_password_popup_new_password_valid',
  /**
   * @analytic profile_change_password_popup_confirm_password_valid
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  PROFILE_CHANGE_PASSWORD_POPUP_CONFIRM_PASSWORD_VALID = 'profile_change_password_popup_confirm_password_valid',
  /**
   * @analytic profile_change_password_popup_password_missmatch
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  PROFILE_CHANGE_PASSWORD_POPUP_PASSWORD_MISSMATCH = 'profile_change_password_popup_password_missmatch',
  /**
   * @analytic profile_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  PROFILE_CHANGE_PASSWORD_POPUP_ERROR = 'profile_change_password_popup_error',
  /**
   * @analytic profile_change_password_popup_success
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', error_code: number, error_text: string, fleet_id: string}
   */
  PROFILE_CHANGE_PASSWORD_POPUP_SUCCESS = 'profile_change_password_popup_success',
  /**
   * @analytic profile_change_password_popup_submit
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  PROFILE_CHANGE_PASSWORD_POPUP_SUBMIT = 'profile_change_password_popup_submit',
  /**
   * @analytic feedbacks_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FEEDBACKS_SCREEN = 'feedbacks_screen',
  /**
   * @analytic feedbacks_drivers_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FEEDBACKS_DRIVERS_FILTER = 'feedbacks_drivers_filter',
  /**
   * @analytic feedbacks_period_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', period_type: string, start_date?: number, end_date?: number, fleet_id: string}
   */
  FEEDBACKS_PERIOD_FILTER = 'feedbacks_period_filter',
  /**
   * @analytic sidebar_toggle
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', view: 'Closed' | 'Opened', fleet_id: string}
   */
  SIDEBAR_TOGGLE = 'sidebar_toggle',
  /**
   * @analytic sidebar_open_language_menu
   * @example {ip: string, user_agent: string, fleet_id: string}
   */
  SIDEBAR_OPEN_LANGUAGE_MENU = 'sidebar_open_language_menu',
  /**
   * @analytic sidebar_menu_navigation
   * @example {ip: string, user_agent: string, page_name: string, fleet_id: string}
   */
  SIDEBAR_MENU_NAVIGATION = 'sidebar_menu_navigation',
  /**
   * @analytic couriers_live_map_toggle_active_order
   * @example {ip: string, user_agent: string, ride_status: string, fleet_id: string}
   */
  COURIERS_LIVE_MAP_TOGGLE_ACTIVE_ORDER = 'couriers_live_map_toggle_active_order',
  /**
   * @analytic couriers_live_map_drivers_group_selected
   * @example {ip: string, user_agent: string, drivers_list_status: string, fleet_id: string}
   */
  COURIERS_LIVE_MAP_DRIVERS_GROUP_SELECTED = 'couriers_live_map_drivers_group_selected',
  /**
   * @analytic live_map_courier_selected
   * @example {ip: string, user_agent: string, fleet_id: string}
   */
  COURIERS_LIVE_MAP_COURIER_SELECTED = 'live_map_courier_selected',
  /**
   * @analytic couriers_live_map_toggle_full_screen
   * @example {ip: string, user_agent: string, fullScreen: 'on' | 'off', fleet_id: string}
   */
  COURIERS_LIVE_MAP_TOGGLE_FULL_SCREEN = 'couriers_live_map_toggle_full_screen',
  /**
   * @analytic couriers_live_map_search_back_btn
   * @example {ip: string, user_agent: string, fleet_id: string}
   */
  COURIERS_LIVE_MAP_SEARCH_BACK_BTN = 'couriers_live_map_search_back_btn',
  /**
   * @analytic couriers_live_map_toggle_panel
   * @example {ip: string, user_agent: string, view: 'opened' | 'closed', panel: string, fleet_id: string}
   */
  COURIERS_LIVE_MAP_TOGGLE_PANEL = 'couriers_live_map_toggle_panel',
  /**
   * @analytic couriers_live_map_popup_open_driver_details
   * @example {ip: string, user_agent: string, link_type: 'driver_map', fleet_id: string}
   */
  COURIERS_LIVE_MAP_POPUP_OPEN_DRIVER_DETAILS = 'couriers_live_map_popup_open_driver_details',
  /**
   * @analytic couriers_live_map_drivers_search
   * @example {ip: string, user_agent: string, ride_status: string, drivers_count: number, fleet_id: string}
   */
  COURIERS_LIVE_MAP_DRIVERS_SEARCH = 'couriers_live_map_drivers_search',
  /**
   * @analytic fleet_profile_page
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FLEET_PROFILE_PAGE = 'fleet_profile_page',
  /**
   * @analytic fleet_profile_history_tab
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FLEET_PROFILE_HISTORY_TAB = 'fleet_profile_history_tab',
  /**
   * @analytic fleet_profile_contacts_tab
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FLEET_PROFILE_CONTACTS_TAB = 'fleet_profile_contacts_tab',
  /**
   * @analytic fleet_profile_event_type_filter_opened
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FLEET_PROFILE_EVENT_TYPE_FILTER_OPENED = 'fleet_profile_event_type_filter_opened',
  /**
   * @analytic fleet_profile_history_event_type_selected
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', history_event_type: string, fleet_id: string}
   */
  FLEET_PROFILE_HISTORY_EVENT_TYPE_SELECTED = 'fleet_profile_history_event_type_selected',
  /**
   * @analytic fleet_profile_history_details_opened
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', history_event_type: string, history_details_info: Record<string, unknown>, fleet_id: string}
   */
  FLEET_PROFILE_HISTORY_DETAILS_OPENED = 'fleet_profile_history_details_opened',
  /**
   * @analytic fleet_profile_history_details_closed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', history_event_type: string, fleet_id: string}
   */
  FLEET_PROFILE_HISTORY_DETAILS_CLOSED = 'fleet_profile_history_details_closed',
  /**
   * @analytic fleet_merchant_popover
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', receivers_count: number, fleet_id: string}
   */
  FLEET_MERCHANT_POPOVER = 'fleet_merchant_popover',
  /**
   * @analytic fleet_driver_report_details
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FLEET_DRIVER_REPORT_DETAILS = 'fleet_driver_report_details',
  /**
   * @analytic fleet_order_report_details
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FLEET_ORDER_REPORT_DETAILS = 'fleet_order_report_details',
  /**
   * @analytic fleet_vehicle_report_details
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FLEET_VEHICLE_REPORT_DETAILS = 'fleet_vehicle_report_details',
  /**
   * @analytic fleet_photo_control_list_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  FLEET_PHOTO_CONTROL_LIST_SCREEN = 'fleet_photo_control_list_screen',
  /**
   * @analytic fleet_photo_control_list_navigate_to_photo_control
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', vehicle_id: string, fleet_id: string}
   */
  FLEET_PHOTO_CONTROL_LIST_NAVIGATE_TO_PHOTO_CONTROL = 'fleet_photo_control_list_navigate_to_photo_control',
  /**
   * @analytic vehicle_details_navigate_to_photo_control
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', vehicle_id: string, fleet_id: string}
   */
  VEHICLE_DETAILS_NAVIGATE_TO_PHOTO_CONTROL = 'vehicle_details_navigate_to_photo_control',
  /**
   * @analytic fleet_photo_control_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', vehicle_id: string, ticket_id: string, ticket_status: string, source: 'Web' | 'UD', vehicle_id: string, photo: string, fleet_id: string}
   */
  FLEET_PHOTO_CONTROL_SCREEN = 'fleet_photo_control_screen',
  /**
   * @analytic fleet_photo_control_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', vehicle_id: string, ticket_id: string, ticket_status: string, source: 'Web' | 'UD', vehicle_id: string, fleet_id: string}
   */
  FLEET_PHOTO_CONTROL_IMG_PLACEHOLDER_CLICK = 'fleet_photo_control_img_placeholder_click',
  /**
   * @analytic fleet_photo_control_img_uploaded
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', vehicle_id: string, ticket_id: string, ticket_status: string, source: 'Web' | 'UD', vehicle_id: string, fleet_id: string}
   */
  FLEET_PHOTO_CONTROL_IMG_UPLOADED = 'fleet_photo_control_img_uploaded',
  /**
   * @analytic fleet_submit_photo_control
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', vehicle_id: string, ticket_id: string, ticket_status: string, source: 'Web' | 'UD', vehicle_id: string, fleet_id: string}
   */
  FLEET_SUBMIT_PHOTO_CONTROL = 'fleet_submit_photo_control',
  /**
   * @analytic bonuses_vehicles_page
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  BONUSES_VEHICLES_PAGE = 'bonuses_vehicles_page',
  /**
   * @analytic bonuses_vehicles_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', vehicle_id: string, fleet_id: string}
   */
  BONUSES_VEHICLES_FILTER = 'bonuses_vehicles_filter',
  /**
   * @analytic bonuses_vehicles_toggle_row
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', view: 'open' | 'close', fleet_id: string}
   */
  BONUSES_VEHICLES_TOGGLE_ROW = 'bonuses_vehicles_toggle_row',
  /**
   * @analytic bonuses_branding_type_dropdown
   * @example { state: true | false, fleet_id: string }
   */
  BONUSES_BRANDING_TYPE_DROPDOWN = 'bonuses_branding_type_dropdown',
  /**
   * @analytic commission_programs_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  COMMISSION_PROGRAMS_SCREEN = 'commission_programs_screen',

  /**
   * @analytic commission_programs_what_is_it
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', active_tab: 'active | planned | archived', fleet_id: string}
   */
  COMMISSION_PROGRAMS_WHAT_IS_IT = 'commission_programs_what_is_it',

  /**
   * @analytic commission_programs_sub_tab_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', active_tab: 'active | planned | archived', fleet_id: string}
   */
  COMMISSION_PROGRAMS_SUB_TAB_CLICK = 'commission_programs_sub_tab_click',

  /**
   * @analytic commission_programs_driver_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', active_tab: 'active | planned | archived', driver_id: string, fleet_id: string}
   */
  COMMISSION_PROGRAMS_DRIVER_FILTER = 'commission_programs_driver_filter',

  /**
   * @analytic commission_programs_driver_filter_clear
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', active_tab: 'active | planned | archived', fleet_id: string}
   */
  COMMISSION_PROGRAMS_DRIVER_FILTER_CLEAR = 'commission_programs_driver_filter_clear',

  /**
   * @analytic active_commission_program_toggle
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', state: 'open | closed', driver_id: string, program_id: string, fleet_id: string}
   */
  ACTIVE_COMMISSION_PROGRAM_TOGGLE = 'active_commission_program_toggle',

  /**
   * @analytic active_commission_program_budget_tooltip_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  ACTIVE_COMMISSION_PROGRAM_BUDGET_TOOLTIP_CLICK = 'active_commission_program_budget_tooltip_click',

  /**
   * @analytic planned_commission_program_budget_tooltip_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  PLANNED_COMMISSION_PROGRAM_BUDGET_TOOLTIP_CLICK = 'planned_commission_program_budget_tooltip_click',

  /**
   * @analytic archived_commission_program_budget_tooltip_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  ARCHIVED_COMMISSION_PROGRAM_BUDGET_TOOLTIP_CLICK = 'archived_commission_program_budget_tooltip_click',

  /**
   * @analytic archived_commission_program_toggle
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', state: 'open | closed', driver_id: string, program_id: string, fleet_id: string}
   */
  ARCHIVED_COMMISSION_PROGRAM_TOGGLE = 'archived_commission_program_toggle',

  /**
   * @analytic vehicle_commission_programs_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  VEHICLE_COMMISSION_PROGRAMS_SCREEN = 'vehicle_commission_programs_screen',

  /**
   * @analytic vehicle_commission_programs_sub_tab_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', active_tab: 'active | planned | archived', fleet_id: string}
   */
  VEHICLE_COMMISSION_PROGRAMS_SUB_TAB_CLICK = 'vehicle_commission_programs_sub_tab_click',

  /**
   * @analytic vehicle_commission_programs_what_is_it
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', active_tab: 'active | planned | archived', fleet_id: string}
   */
  VEHICLE_COMMISSION_PROGRAMS_WHAT_IS_IT = 'vehicle_commission_programs_what_is_it',

  /**
   * @analytic vehicle_commission_programs_licence_plate_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', active_tab: 'active | planned | archived', driver_id: string, fleet_id: string}
   */
  VEHICLE_COMMISSION_PROGRAMS_LICENCE_PLATE_FILTER = 'vehicle_commission_programs_licence_plate_filter',

  /**
   * @analytic vehicle_commission_programs_licence_plate_filter_clear
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', active_tab: 'active | planned | archived', fleet_id: string}
   */
  VEHICLE_COMMISSION_PROGRAMS_LICENCE_FILTER_CLEAR = 'vehicle_commission_programs_licence_plate_filter_clear',

  /**
   * @analytic active_vehicle_commission_program_toggle
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', state: 'open | closed', driver_id: string, program_id: string, fleet_id: string}
   */
  ACTIVE_VEHICLE_COMMISSION_PROGRAM_TOGGLE = 'active_vehicle_commission_program_toggle',

  /**
   * @analytic active_vehicle_commission_program_budget_tooltip_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  ACTIVE_VEHICLE_COMMISSION_PROGRAM_BUDGET_TOOLTIP_CLICK = 'active_vehicle_commission_program_budget_tooltip_click',

  /**
   * @analytic active_vehicle_commission_program_progress_tooltip_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  ACTIVE_VEHICLE_COMMISSION_PROGRAM_PROGRESS_TOOLTIP_CLICK = 'active_vehicle_commission_program_progress_tooltip_click',

  /**
   * @analytic planned_vehicle_commission_program_toggle
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', state: 'open | closed', driver_id: string, program_id: string, fleet_id: string}
   */
  PLANNED_VEHICLE_COMMISSION_PROGRAM_TOGGLE = 'planned_vehicle_commission_program_toggle',

  /**
   * @analytic planned_vehicle_commission_program_budget_tooltip_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  PLANNED_VEHICLE_COMMISSION_PROGRAM_BUDGET_TOOLTIP_CLICK = 'planned_vehicle_commission_program_budget_tooltip_click',

  /**
   * @analytic planned_vehicle_commission_program_progress_tooltip_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  PLANNED_VEHICLE_COMMISSION_PROGRAM_PROGRESS_TOOLTIP_CLICK = 'planned_vehicle_commission_program_progress_tooltip_click',

  /**
   * @analytic archived_vehicle_commission_program_toggle
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', state: 'open | closed', driver_id: string, program_id: string, fleet_id: string}
   */
  ARCHIVED_VEHICLE_COMMISSION_PROGRAM_TOGGLE = 'archived_vehicle_commission_program_toggle',

  /**
   * @analytic archived_vehicle_commission_program_budget_tooltip_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  ARCHIVED_VEHICLE_COMMISSION_PROGRAM_BUDGET_TOOLTIP_CLICK = 'archived_vehicle_commission_program_budget_tooltip_click',

  /**
   * @analytic archived_vehicle_commission_program_progress_tooltip_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  ARCHIVED_VEHICLE_COMMISSION_PROGRAM_PROGRESS_TOOLTIP_CLICK = 'archived_vehicle_commission_program_progress_tooltip_click',

  /**
   * @analytic toggle_branding_programs
   * @example {state: true | false, fleet_id: string}
   */
  TOGGLE_BRANDING_PROGRAMS = 'toggle_branding_programs',
  /**
   * @analytic vehicle_reports_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  VEHICLES_REPORTS_SCREEN = 'vehicle_reports_screen',
  /**
   * @analytic vehicle_reports_date_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', start_date: number, end_date: number, fleet_id: string}
   */
  VEHICLES_REPORTS_DATE_FILTER = 'vehicle_reports_date_filter',
  /**
   * @analytic vehicle_reports_vehicle_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', vehicle_id: string, fleet_id: string}
   */
  VEHICLES_REPORTS_VEHICLE_FILTER = 'vehicle_reports_vehicle_filter',
  /**
   * @analytic vehicle_reports_export_csv
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  VEHICLES_REPORTS_EXPORT_CSV = 'vehicle_reports_export_csv',
  /**
   * @analytic nps_dialog_opened
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', url: string, fleet_id: string}
   */
  NPS_DIALOG_OPENED = 'nps_dialog_opened',
  /**
   * @analytic nps_dialog_backdrop_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  NPS_DIALOG_BACKDROP_CLICK = 'nps_dialog_backdrop_click',
  /**
   * @analytic nps_dialog_skip
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  NPS_DIALOG_SKIP = 'nps_dialog_skip',
  /**
   * @analytic nps_dialog_later_btn_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', fleet_id: string}
   */
  NPS_DIALOG_LATER_BTN_CLICK = 'nps_dialog_later_btn_click',
  /**
   * @analytic nps_dialog_submit
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', mark: number, fleet_id: string}
   */
  NPS_DIALOG_SUBMIT = 'nps_dialog_submit',
  /**
   * @analytic nps_dialog_mark_change
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', mark: number, mark_state: 'selected' | 'unselected', fleet_id: string}
   */
  NPS_DIALOG_MARK_CHANGE = 'nps_dialog_mark_change',
  /**
   * @analytic nps_dialog_close_btn_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', url: string, fleet_id: string}
   */
  NPS_DIALOG_CLOSE_BTN_CLICK = 'nps_dialog_close_btn_click',
  /**
   * @analytic notifications_icon_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', unread: number, fleet_id: string}
   */
  NOTIFICATIONS_ICON_CLICK = 'notifications_icon_click',
  /**
   * @analytic notifications_sidenav_close_icon_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', unread: number, fleet_id: string}
   */
  NOTIFICATIONS_SIDENAV_CLOSE_ICON_CLICK = 'notifications_sidenav_close_icon_click',
  /**
   * @analytic notifications_sidenav_close_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', unread: number, fleet_id: string}
   */
  NOTIFICATIONS_SIDENAV_CLOSE_CLICK = 'notifications_sidenav_close_click',
  /**
   * @analytic notifications_sidenav_read_all
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', unread: number, fleet_id: string}
   */
  NOTIFICATIONS_SIDENAV_READ_ALL = 'notifications_sidenav_read_all',
  /**
   * @analytic notification_read_marker_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', unread: number, notification_type: string, notification_state: 'read' | 'unread', fleet_id: string}
   */
  NOTIFICATIONS_READ_MARKER_CLICK = 'notification_read_marker_click',
  /**
   * @analytic notification_link_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', unread: number, notification_type: string, notification_state: 'read' | 'unread', fleet_id: string}
   */
  NOTIFICATIONS_LINK_CLICK = 'notification_link_click',
  /**
   * @analytic fleet_manager_panel_opened
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string, fleet_id: string}
   * @description “Contact manager” button click
   */
  FLEET_MANAGER_PANEL_OPENED = 'fleet_manager_panel_opened',
  /**
   * @analytic fleet_manager_panel_closed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string, fleet_id: string}
   * @description Contact manager panel closed
   */
  FLEET_MANAGER_PANEL_CLOSED = 'fleet_manager_panel_closed',
  /**
   * @analytic fleet_manager_panel_copy_phone
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', description: string, page: string, fleet_id: string}
   * @description Contact manager panel copy phone icon click
   */
  FLEET_MANAGER_PANEL_COPY_PHONE = 'fleet_manager_panel_copy_phone',
  /**
   * @analytic fleet_manager_panel_copy_email
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string, fleet_id: string}
   * @description Contact manager panel copy email icon click
   */
  FLEET_MANAGER_PANEL_COPY_EMAIL = 'fleet_manager_panel_copy_email',
  /**
   * @analytic fleet_manager_panel_contact_via_phone_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string, fleet_id: string}
   * @description Contact manager panel phone icon click
   */
  FLEET_MANAGER_PANEL_CONTACT_VIA_PHONE_CLICK = 'fleet_manager_panel_contact_via_phone_click',
  /**
   * @analytic fleet_manager_panel_contact_via_email_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string, fleet_id: string}
   * @description Contact manager panel email icon click
   */
  FLEET_MANAGER_PANEL_CONTACT_VIA_EMAIL_CLICK = 'fleet_manager_panel_contact_via_email_click',
  /**
   * @analytic fleet_manager_panel_contact_via_telegram_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string, fleet_id: string}
   * @description Contact manager panel Telegram icon click
   */
  FLEET_MANAGER_PANEL_CONTACT_VIA_TELEGRAM_CLICK = 'fleet_manager_panel_contact_via_telegram_click',
  /**
   * @analytic fleet_manager_panel_contact_via_viber_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', page: string, fleet_id: string}
   * @description Contact manager panel Viber icon click
   */
  FLEET_MANAGER_PANEL_CONTACT_VIA_VIBER_CLICK = 'fleet_manager_panel_contact_via_viber_click',
  /**
   * @analytic notification_description_popup
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', notification_type: string, notification_id: string, image_present: boolean, page: string, accepted: boolean, fleet_id: string}
   * @description Notification popup with description is opened
   */
  NOTIFICATION_DESCRIPTION_POPUP = 'notification_description_popup',
  /**
   * @analytic notification_description_popup_close
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager', notification_type: string, notification_id: string, image_present: boolean, page: string, fleet_id: string}
   * @description Notification popup with description is closed
   */
  NOTIFICATION_DESCRIPTION_POPUP_CLOSE = 'notification_description_popup_close',
  /**
   * @analytic finance_cash_limits_screen
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', fleet_id: string}
   * @description Cash limits tab opened
   */
  FINANCE_CASH_LIMITS_SCREEN = 'finance_cash_limits_screen',
  /**
   * @analytic finance_cash_limits_guide_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', fleet_id: string}
   * @description Click on guide button on cash limits tab
   */
  FINANCE_CASH_LIMITS_GUIDE_CLICK = 'finance_cash_limits_guide_click',
  /**
   * @analytic finance_cash_limits_guide_closed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', fleet_id: string}
   * @description Cash limits guide closed
   */
  FINANCE_CASH_LIMITS_GUIDE_CLOSED = 'finance_cash_limits_guide_closed',
  /**
   * @analytic finance_cash_limits_settings_button_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', action: 'setup' | 'edit', fleet_id: string}
   * @description Click on “Configure” button on cash limits tab
   */
  FINANCE_CASH_LIMITS_SETTINGS_BUTTON_CLICK = 'finance_cash_limits_settings_button_click',
  /**
   * @analytic finance_cash_limits_period_settings
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', period: 'Week' | 'Day'm action: 'setup' | 'edit', fleet_id: string}
   * @description Switching the period in the cash limits settings popup
   */
  FINANCE_CASH_LIMITS_PERIOD_SETTINGS = 'finance_cash_limits_period_settings',
  /**
   * @analytic finance_cash_limits_type_settings
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', type: 'FleetLimit' | 'NoLimit', action: 'setup' | 'edit', fleet_id: string}
   * @description Switching the limit type in the cash limits settings popup
   */
  FINANCE_CASH_LIMITS_TYPE_SETTINGS = 'finance_cash_limits_type_settings',
  /**
   * @analytic finance_cash_limits_setting_save
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', period: 'Week' | 'Day', type: 'FleetLimit' | 'NoLimit', amount: number, error_code: number, error_text: string, action: 'setup' | 'edit', fleet_id: string}
   * @description Cash limits settings for the fleet saved
   */
  FINANCE_CASH_LIMITS_SETTING_SAVE = 'finance_cash_limits_setting_save',
  /**
   * @analytic finance_cash_limits_settings_closed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', action: 'setup' | 'edit', fleet_id: string}
   * @description Cash limits settings popup for the fleet closed
   */
  FINANCE_CASH_LIMITS_SETTINGS_CLOSED = 'finance_cash_limits_settings_closed',
  /**
   * @analytic finance_cash_limits_editing_restriction_warning
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', drivers_amount: number, type: 'FleetLimit', amount: number, action: 'setup' | 'edit', fleet_id: string}
   * @description Opening the drivers restriction information popup at the time of saving the fleet settings
   */
  FINANCE_CASH_LIMITS_EDITING_RESTRICTION_WARNING = 'finance_cash_limits_editing_restriction_warning',
  /**
   * @analytic finance_cash_limits_editing_restriction_warning_approve
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', drivers_amount: number, type: 'FleetLimit', amount: number, fleet_id: string}
   * @description Click on the “Apply” button in the drivers restriction information popup at the time of saving the fleet settings
   */
  FINANCE_CASH_LIMITS_EDITING_RESTRICTION_WARNING_APPROVE = 'finance_cash_limits_editing_restriction_warning_approve',
  /**
   * @analytic finance_cash_limits_editing_restriction_warning_approve
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', drivers_amount: number, type: 'FleetLimit', amount: number, fleet_id: string}
   * @description Drivers restriction information popup at the time of saving the fleet settings closed
   */
  FINANCE_CASH_LIMITS_EDITING_RESTRICTION_WARNING_CLOSED = 'finance_cash_limits_editing_restriction_warning_closed',
  /**
   * @analytic finance_cash_limits_name_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', name: string, fleet_id: string}
   * @description Filter by driver on the cash limits tab applied
   */
  FINANCE_CASH_LIMITS_NAME_FILTER = 'finance_cash_limits_name_filter',
  /**
   * @analytic finance_cash_limits_phone_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', phone: string, fleet_id: string}
   * @description Filter by phone number on the cash limits tab applied
   */
  FINANCE_CASH_LIMITS_PHONE_FILTER = 'finance_cash_limits_phone_filter',
  /**
   * @analytic finance_cash_limits_cash_limit_type_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', cash_limit_type: 'Fleet' | 'Individual' | 'NoLimits' | '', fleet_id: string}
   * @description Filter by limit type on the cash limits tab applied
   */
  FINANCE_CASH_LIMITS_CASH_LIMIT_TYPE_FILTER = 'finance_cash_limits_cash_limit_type_filter',
  /**
   * @analytic finance_cash_limits_has_restriction_by_cash_limit_filter
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', has_restriction_by_cash_limit: boolean, fleet_id: string}
   * @description Filter by restriction availability on the cash limits tab applied
   */
  FINANCE_CASH_LIMITS_HAS_RESTRICTION_BY_CASH_LIMIT_FILTER = 'finance_cash_limits_has_restriction_by_cash_limit_filter',
  /**
   * @analytic finance_cash_limits_edit_driver_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', driver_id: string, fleet_id: string}
   * @description Click on the edit icon for a specific driver on the cash limits tab
   */
  FINANCE_CASH_LIMITS_EDIT_DRIVER_CLICK = 'finance_cash_limits_edit_driver_click',
  /**
   * @analytic finance_cash_limits_batch_drivers_edit
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', drivers_amount: number, fleet_id: string}
   * @description Click on the “Edit” button to set the cash limit type for selected drivers
   */
  FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT = 'finance_cash_limits_batch_drivers_edit',
  /**
   * @analytic finance_cash_limits_edit_driver_popup_type
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', type: 'Fleet' | 'Individual' | 'NoLimit', amount: number, driver_id: string, fleet_id: string}
   * @description Switching the limit type in the edit popup for a specific driver
   */
  FINANCE_CASH_LIMITS_EDIT_DRIVER_POPUP_TYPE = 'finance_cash_limits_edit_driver_popup_type',
  /**
   * @analytic finance_cash_limits_batch_drivers_edit_popup_type
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', type: 'Fleet' | 'Individual' | 'NoLimit', amount: number, drivers_amount: number, fleet_id: string}
   * @description Switching the limit type in the edit popup for a list of drivers
   */
  FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT_POPUP_TYPE = 'finance_cash_limits_batch_drivers_edit_popup_type',
  /**
   * @analytic finance_cash_limits_edit_driver_popup_save
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', type: 'Fleet' | 'Individual' | 'NoLimit', amount: number, driver_id: string, error_code: number, error_text: string, fleet_id: string}
   * @description Limit type in the edit popup for a specific driver saved
   */
  FINANCE_CASH_LIMITS_EDIT_DRIVER_POPUP_SAVE = 'finance_cash_limits_edit_driver_popup_save',
  /**
   * @analytic finance_cash_limits_batch_drivers_edit_popup_save
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', type: 'Fleet' | 'Individual' | 'NoLimit', amount: number, drivers_amount: number, error_code: number, error_text: string, fleet_id: string}
   * @description Limit type in the edit popup for a list of drivers saved
   */
  FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT_POPUP_SAVE = 'finance_cash_limits_batch_drivers_edit_popup_save',
  /**
   * @analytic finance_cash_limits_edit_driver_popup_closed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', driver_id: number, fleet_id: string}
   * @description Edit popup for a specific driver closed
   */
  FINANCE_CASH_LIMITS_EDIT_DRIVER_POPUP_CLOSED = 'finance_cash_limits_edit_driver_popup_closed',
  /**
   * @analytic finance_cash_limits_batch_drivers_edit_popup_closed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', drivers_amount: number, fleet_id: string}
   * @description Edit popup for a list of drivers closed
   */
  FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT_POPUP_CLOSED = 'finance_cash_limits_batch_drivers_edit_popup_closed',
  /**
   * @analytic finance_cash_limits_batch_drivers_cancel
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', drivers_amount: number, fleet_id: string}
   * @description Click on the “Cancel” button for selected drivers on the cash limits tab
   */
  FINANCE_CASH_LIMITS_BATCH_DRIVERS_CANCEL = 'finance_cash_limits_batch_drivers_cancel',
  /**
   * @analytic finance_cash_limits_edit_driver_restriction_warning
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', driver_id: string, type: 'Fleet' | 'Individual' | 'NoLimit', amount: number, fleet_id: string}
   * @description Opening the driver restriction information popup
   */
  FINANCE_CASH_LIMITS_EDIT_DRIVER_RESTRICTION_WARNING = 'finance_cash_limits_edit_driver_restriction_warning',
  /**
   * @analytic finance_cash_limits_batch_drivers_edit_restriction_warning
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', drivers_amount: number, type: 'Fleet' | 'Individual' | 'NoLimit', amount: number, fleet_id: string}
   * @description Opening the drivers restriction information popup
   */
  FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT_RESTRICTION_WARNING = 'finance_cash_limits_batch_drivers_edit_restriction_warning',
  /**
   * @analytic finance_cash_limits_edit_driver_restriction_warning_approve
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', driver_id: string, type: 'Fleet' | 'Individual' | 'NoLimit', amount: number, fleet_id: string}
   * @description Click on the “Apply” button in the driver restriction information popup
   */
  FINANCE_CASH_LIMITS_EDIT_DRIVER_RESTRICTION_WARNING_APPROVE = 'finance_cash_limits_edit_driver_restriction_warning_approve',
  /**
   * @analytic finance_cash_limits_batch_drivers_edit_restriction_warning_approve
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', drivers_amount: number, type: 'Fleet' | 'Individual' | 'NoLimit', amount: number, fleet_id: string}
   * @description Click on the “Apply” button in the drivers restriction information popup
   */
  FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT_RESTRICTION_WARNING_APPROVE = 'finance_cash_limits_batch_drivers_edit_restriction_warning_approve',
  /**
   * @analytic finance_cash_limits_edit_driver_restriction_warning_closed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', driver_id: string, type: 'Fleet' | 'Individual' | 'NoLimit', amount: number, fleet_id: string}
   * @description Driver restriction information popup closed
   */
  FINANCE_CASH_LIMITS_EDIT_DRIVER_RESTRICTION_WARNING_CLOSED = 'finance_cash_limits_edit_driver_restriction_warning_closed',
  /**
   * @analytic finance_cash_limits_batch_drivers_edit_restriction_warning_closed
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'finance_cash_limits', drivers_amount: number, type: 'Fleet' | 'Individual' | 'NoLimit', amount: number, fleet_id: string}
   * @description Drivers restriction information popup closed
   */
  FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT_RESTRICTION_WARNING_CLOSED = 'finance_cash_limits_batch_drivers_edit_restriction_warning_closed',
  /**
   * @analytic uklon_garage_review_application_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'drivers_applications', request_id: string}
   * @description Click on review application button
   */
  UKLON_GARAGE_REVIEW_APPLICATION_CLICK = 'uklon_garage_review_application_click',
  /**
   * @analytic driver_filters_details_click
   * @example {ip: string, user_agent: string, user_access: 'Owner' | 'Manager' page: 'live_map' | 'drivers_list', fleet_id: string. driver_id: string}
   * @description Click on driver’s filter details
   */
  DRIVER_FILTERS_DETAILS_CLICK = 'driver_filters_details_click',
}
