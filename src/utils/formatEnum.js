export const currencies = [
  {
    value: 'USD',
    label: '$',
    valueStr: 'Доллар'
  },
  {
    value: 'EUR',
    label: '€',
    valueStr: 'Евро'
  },
  {
    value: 'RUB',
    label: '₽',
    valueStr: 'Рубль'
  }
];

export function fCurrencyByEnum(enumStr) {
  return currencies.find(value => value.value === enumStr);
}

export function fStatusTransaction(status) {
  if (status === 'CLOSED') {
    return 'Завершена'
  }
  if (status === 'CANCELED') {
    return 'Отменена'
  }
  if (status === 'CREATED') {
    return 'Создана'
  }
  return status
}

export function fTypeTransaction(type) {
  if (type === 'TRANSFER') {
    return 'Перевод'
  }
  if (type === 'PAYMENT') {
    return 'Оплата'
  }
  return type
}

export function fStatusConfirmed(status) {
  if (status === "CONFIRMED") {
    return "Подтвержден"
  }
  if (status === "NOT_CONFIRMED") {
    return "Не подтвержден"
  }
  if (status === "FAILED_CONFIRMED") {
    return "Данные не подтвердились"
  }
  return status
}

export function fRoleCompany(role) {
  if (role === "OWNER") {
    return "Владелец"
  }
  return role
}