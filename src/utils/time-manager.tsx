import dayjs from 'dayjs';

export function parseDateString(timestamp: string) {
    return dayjs(timestamp).format('DD/MM/YYYY');
}

export function parseMonthDateString(timestamp: string) {
    return dayjs(timestamp).format('MM/DD/YYYY');
}
