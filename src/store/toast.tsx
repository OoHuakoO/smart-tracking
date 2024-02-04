import { Toast } from '@src/typings/common';
import { atom, RecoilState } from 'recoil';

export const toastState: RecoilState<Toast> = atom({
    key: 'Toast',
    default: {
        open: false,
        text: ''
    }
});
