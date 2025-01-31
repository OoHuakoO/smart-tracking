import { LoginState } from '@src/typings/common';
import { atom, RecoilState } from 'recoil';

export const loginState: RecoilState<LoginState> = atom({
    key: 'Login',
    default: {
        uid: ''
    }
});

export const CompanyModeState: RecoilState<string> = atom({
    key: 'CompanyMode',
    default: ''
});

export const OnlineState: RecoilState<boolean> = atom({
    key: 'Online',
    default: undefined
});

export const BranchState: RecoilState<string> = atom({
    key: 'Branch',
    default: ''
});

