import moment from "moment";

export const getComponentsInRowNumber = () => {
  let componentsInRowNumber = 4;
  switch (true) {
    case window.matchMedia("(max-width: 400px)").matches:
      componentsInRowNumber = 1;
      break;
    case window.matchMedia("(max-width: 580px)").matches:
      componentsInRowNumber = 2;
      break;
    case window.matchMedia("(max-width: 709px)").matches:
      componentsInRowNumber = 3;
      break;
    case window.matchMedia("(max-width: 999px)").matches:
      componentsInRowNumber = 3;
      break;
    case window.matchMedia("(max-width: 1500px)").matches:
      componentsInRowNumber = 4;
      break;
    case window.matchMedia("(max-width: 2000px)").matches:
      componentsInRowNumber = 5;
      break;
    case window.matchMedia("(max-width: 2500px)").matches:
      componentsInRowNumber = 6;
      break;
    case window.matchMedia("(max-width: 3000px)").matches:
      componentsInRowNumber = 7;
      break;
    case window.matchMedia("(min-width: 3000px)").matches:
      componentsInRowNumber = 8;
      break;
  }
  return componentsInRowNumber;
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  switch (true) {
    case hour < 6 || (hour <= 24 && hour > 22):
      return "Доброй ночи";
    case hour >= 6 && hour < 11:
      return "Доброе утро";
    case hour >= 11 && hour < 18:
      return "Добрый день";
    case hour >= 18:
      return "Добрый вечер";
  }
};

export function getOffsetDate(date) {
  const [offsetYears, offsetMonths, offsetDays] = getOffsetDateNumbers(date);

  const years = addPostfix(offsetYears, "year");
  const months = addPostfix(offsetMonths, "month");
  const days = addPostfix(offsetDays, "day");

  return `${offsetYears !== 0 ? years : ""}
          ${offsetMonths !== 0 ? months : ""}
          ${offsetDays !== 0 ? days : ""}`;
}

function getOffsetDateNumbers(date) {
  date = moment(date);
  const now = moment();

  const offsetYears = now.diff(date, "years");
  date = date.add(offsetYears, "years");

  const offsetMonths = now.diff(date, "months");
  date = date.add(offsetMonths, "months");

  const offsetDays = now.diff(date, "days");

  return [offsetYears, offsetMonths, offsetDays]
}

function addPostfix(number, type) {
  const words = getWordsForDateType(type);

  switch (number) {
    case 11:
    case 12:
    case 13:
    case 14:
      return `${number} ${words[2]}`;
  }

  switch (number % 10) {
    case 1:
      return `${number} ${words[0]}`;
    case 2:
    case 3:
    case 4:
      return `${number} ${words[1]}`;
    default:
      return `${number} ${words[2]}`;
  }
}

function getWordsForDateType(type) {
  switch (type) {
    case "year":
      return ["год", "года", "лет"];
    case "month":
      return ["месяц", "месяца", "месяцев"];
    case "day":
      return ["день", "дня", "дней"];
    default:
      console.error(`Unknown type ${type}, available types: year, month, day`);
      return [];
  }
}
