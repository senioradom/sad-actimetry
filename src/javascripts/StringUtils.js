export default class StringUtils {
  static truncate(str, maxLength, useWordBoundary) {
    if (str.length <= maxLength) {
      return str;
    }

    const subString = str.substr(0, maxLength - 1);

    return `${useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(' '))
      : subString}...`;
  }
}
