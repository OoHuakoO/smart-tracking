import { LoginState } from '@src/typings/common';
import { atom, RecoilState } from 'recoil';

export const loginState: RecoilState<LoginState> = atom({
    key: 'Token',
    default: {
        session_id: '',
        uid: ''
    }
});
