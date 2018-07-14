export const getComponentsInRowNumber = () => {
  let componentsInRowNumber = 4;
  switch (true) {
    case window.matchMedia("(max-width: 450px)").matches:
      componentsInRowNumber = 3;
      break;
    case window.matchMedia("(max-width: 709px)").matches:
      componentsInRowNumber = 4;
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
