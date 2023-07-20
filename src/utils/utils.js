export const phoneNumberNormalize = (phoneNumber) => {
  phoneNumber = String(phoneNumber).trim();
  if (phoneNumber.startsWith('+62')) {
    phoneNumber = `62${phoneNumber.slice(3)}`;
  } else if (phoneNumber.startsWith('62')) {
    phoneNumber = `62${phoneNumber.slice(2)}`;
  } else if (phoneNumber.startsWith('0')) {
    phoneNumber = `62${phoneNumber.slice(1)}`;
  } else {
    phoneNumber = `62${phoneNumber}`;
  }
  return phoneNumber.replace(/[- .]/g, '');
};

export const pulsaPhoneNumberNormalize = (phoneNumber) => {
  phoneNumber = String(phoneNumber).trim();
  if (phoneNumber.startsWith('+62')) {
    phoneNumber = `0${phoneNumber.slice(3)}`;
  } else if (phoneNumber.startsWith('62')) {
    phoneNumber = `0${phoneNumber.slice(2)}`;
  } else if (phoneNumber.startsWith('0')) {
    phoneNumber = `0${phoneNumber.slice(1)}`;
  } else {
    phoneNumber = `0${phoneNumber}`;
  }
  return phoneNumber.replace(/[- .]/g, '');
};

export const dataPlanPhoneNumberNormalize = (phoneNumber) => {
  phoneNumber = String(phoneNumber).trim();
  if (phoneNumber.startsWith('+62')) {
    phoneNumber = `0${phoneNumber.slice(3)}`;
  } else if (phoneNumber.startsWith('62')) {
    phoneNumber = `0${phoneNumber.slice(2)}`;
  } else if (phoneNumber.startsWith('0')) {
    phoneNumber = `0${phoneNumber.slice(1)}`;
  } else {
    phoneNumber = `0${phoneNumber}`;
  }
  return phoneNumber.replace(/[- .]/g, '');
};

export const phoneNumberTest = (phoneNumber) => {
  if (!phoneNumber || !/^[1-9][0-9]{7,13}$/.test(phoneNumber)) {
    return false;
  }
  return true;
};

export const phoneNumberValidate = (phoneNumber) => {
  if (phoneNumber === '') {
    return true;
  }
  phoneNumber = phoneNumberNormalize(phoneNumber);
  return phoneNumberTest(phoneNumber);
};

export const currencyFormat = (
  value = 0,
  style = '',
  format = 'id-ID',
  currency = 'IDR',
  minimumFractionDigits = 0
) => {
  return new Intl.NumberFormat(format, {
    ...(style && { style }),
    currency,
    minimumFractionDigits,
  }).format(value);
};

export const sleep = (delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
