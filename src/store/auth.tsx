import { atom, RecoilState } from 'recoil';

export const authState: RecoilState<string> = atom({
    key: 'Token',
    default: ''
});
