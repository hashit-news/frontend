import moment from 'moment';

export const formatTimeSince = (date: Date) => {
  const now = moment.utc();
  const then = moment.utc(date);
  const diff = then.diff(now);
  const duration = moment.duration(diff);

  return duration.humanize(true);
};

export const formatCollapsedNumber = (num: number) => {
  /**
   * Format the display of large numbers.
   * Example:
   * 234                  => 234
   * 2345                 => 2.3K
   * 23456                => 23.4K
   * 234567               => 234.5K
   * 2345678              => 2.3M
   * 23456789             => 23.4M
   * 234567890            => 234M
   * 1 billion or greater => 1 Billion+ ❤️
   */

  const lookup = [
    { compare: 1, value: 1, symbol: '', digits: 0 },
    { compare: 1e3, value: 1e3, symbol: 'k', digits: 1 },
    { compare: 1e6, value: 1e6, symbol: 'M', digits: 1 },
    { compare: 1e8, value: 1e6, symbol: 'M', digits: 0 },
    { compare: 1e9, value: 1e9, symbol: 'B', digits: 0, max: true },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  const item = lookup
    .slice()
    .reverse()
    .find(x => num >= x.compare);

  if (item) {
    return item.max ? '1 Billion+' : `${(num / item.value).toFixed(item.digits).replace(rx, '$1')}${item.symbol}`;
  } else {
    if (num) {
      return num.toFixed(3);
    }
    return '0';
  }
};
