enum Status {
  New = 'New',
  ConfirmedByCustomer = 'ConfirmedByCustomer',
  ConfirmedByProvider = 'ConfirmedByProvider',
  Delivering = 'Delivering',
  Delivered = 'Delivered',
  Canceled = 'Canceled',
}

enum DeliveryMethod {
  Self = 'Self',
  Courier = 'Courier',
}

enum PaymentMethod {
  CourierCash = 'CourierCash',
  CourierCard = 'CourierCard',
  OnlineCard = 'OnlineCard',
}

export { Status, DeliveryMethod, PaymentMethod };
