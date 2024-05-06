import dayjs from 'dayjs';

export function parseDateString(timestamp: string) {
    return dayjs(timestamp).format('DD/MM/YYYY');
}

export function parseMonthDateString(timestamp: string) {
    return dayjs(timestamp).format('MM/DD/YYYY');
}

export function parseDateStringTime(timestamp: string) {
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
}
