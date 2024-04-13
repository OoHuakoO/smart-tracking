import { DocumentState } from '@src/typings/common';
import { DocumentAssetData } from '@src/typings/document';
import { atom, RecoilState } from 'recoil';

export const documentState: RecoilState<DocumentState> = atom({
    key: 'Document',
    default: {
        id: 1,
        state: '',
        location: '',
        location_id: 1
    }
});

export const documentAssetListState: RecoilState<DocumentAssetData[]> = atom({
    key: 'DocumentAssetList',
    default: []
});
