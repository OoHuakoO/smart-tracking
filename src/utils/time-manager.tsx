import dayjs from 'dayjs';

export function parseDateString(timestamp: string) {
    return dayjs(timestamp).format('DD/MM/YYYY');
}
