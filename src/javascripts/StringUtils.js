import moment from 'moment-timezone';

export default class StringUtils {
  static truncate(str, maxLength, useWordBoundary) {
    if (str.length <= maxLength) {
      return str;
    }

    const subString = str.substr(0, maxLength - 1);

    return `${useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString}...`;
  }

  static formatDuration(duration, withSeconds = true) {
    const asSeconds = Math.round(moment.duration(duration).asSeconds());
    const hours = Math.floor(asSeconds / 3600);
    const minutes = withSeconds
      ? Math.floor((asSeconds - hours * 3600) / 60)
      : Math.round((asSeconds - hours * 3600) / 60);
    const seconds = withSeconds ? asSeconds - hours * 3600 - minutes * 60 : 0;

    if (withSeconds) {
      return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
  }

  static roundHalfTime(time, timezone) {
    let m = moment(time).tz(timezone);
    m = m.minute((m.minute() / 30) * 30);
    return m.format('LT');
  }
}
