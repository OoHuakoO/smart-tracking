import { AssetDataForPassParamsDocumentCreate, SearchAsset } from './asset';
import { DocumentAssetData } from './document';
import { AssetData, LocationData } from './downloadDB';

export type RootStackParamsList = {
    PrivateStack: undefined;
    PublicStack: undefined;
};

export type PublicStackParamsList = {
    Setting: undefined;
    Login: undefined;
};

export type PrivateStackParamsList = {
    Setting: undefined;
    Home: undefined;
    Assets: {
        assetSearch: SearchAsset;
    };
    Location: undefined;
    Document: undefined;
    Upload: undefined;
    Download: undefined;
    AssetDetail: {
        assetData: AssetData;
    };
    AssetSearch: undefined;
    LocationListAsset: {
        LocationData: LocationData;
    };
    Report: undefined;
    ReportAssetData: {
        title: string;
    };

    LocationListReportAsset: {
        LocationData: LocationData;
        title: string;
    };
    DocumentAssetStatus: {
        id: number;
        state: string;
        location: string;
        location_id: number;
    };
    DocumentCreate: {
        id: number;
        location: string;
        location_id: number;
        state: string;
        assetDocumentList: DocumentAssetData[];
    };
    DocumentCreateSearch: undefined;
    DocumentCreateAsset: {
        id: number;
        state: string;
        location: string;
        location_id: number;
        code: string;
        onGoBack?: (assetData: AssetDataForPassParamsDocumentCreate) => void;
    };
};
