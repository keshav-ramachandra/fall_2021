export const updateError = (error, stateUpdater) => {
  stateUpdater(error);
  setTimeout(() => {
    stateUpdater("");
  }, 2500);
};

export const isValidMobile = (value) => {
  const regex = /^\d{10}$/;
  return regex.test(value);
};

export const isValidEmail = (value) => {
  const regex = /^([A-Za-z0-9_\-\.])+\@([A_Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  return regex.test(value);
};

export const isValidDate = (dateString) =>
{
    if(!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(dateString))
        return false;
    var parts = dateString.split("-");
    var day = parseInt(parts[2], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[0], 10);

    var dob = new Date(dateString)
    var today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (dob >= yesterday) return false;

    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;
    return day > 0 && day <= monthLength[month - 1];
};
