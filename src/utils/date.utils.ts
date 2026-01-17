import dayjs from 'dayjs';
import { DateTime } from 'luxon';

export function parseLocalDate(dateStr: string): Date {
  return dayjs(dateStr).toDate();
}

export function getMinutesDiff(
  start: string | Date,
  end: string | Date,
): number {
  const startTime = dayjs(start);
  const endTime = dayjs(end);
  return endTime.diff(startTime, 'minute');
}

export function getDurationLabel(
  start: string | Date,
  end: string | Date,
): string {
  const diffMinutes = getMinutesDiff(start, end);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export function nowISO(): string {
  return dayjs().format('YYYY-MM-DDTHH:mm:ss');
}

export function fromGazaToUtc(date: string) {
  return DateTime.fromISO(date, {
    zone: 'Asia/Gaza',
  })
    .toUTC()
    .toJSDate();
}
export function fromUtcToGaza(date: Date) {
  return DateTime.fromJSDate(date, { zone: 'utc' })
    .setZone('Asia/Gaza')
    .toISO();
}

export function formatLocal(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}
