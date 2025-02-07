import { BranchStateProps, LoginState } from '@src/typings/common';
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

export const BranchState: RecoilState<BranchStateProps> = atom({
    key: 'Branch',
    default: {
        branchId: 0,
        branchName: 'no branch'
    }
});
