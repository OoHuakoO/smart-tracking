import { AssetDataForPassParamsDocumentCreate, SearchAsset } from './asset';
import { DocumentAssetData, SearchDocument } from './document';
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
    Document: {
        documentSearch: SearchDocument;
    };
    Upload: undefined;
    Download: undefined;
    AssetDetail: {
        assetData: AssetData;
    };
    AssetSearch: undefined;
    LocationAssetSearch: { LocationData: LocationData };
    LocationListAsset: {
        LocationData: LocationData;
        assetSearch: SearchAsset;
    };
    Report: undefined;
    ReportAssetData: {
        title: string;
    };

    LocationListReportAsset: {
        LocationData: LocationData;
        title: string;
    };
    DocumentAssetDetail: { assetData: DocumentAssetData };
    DocumentSearch: undefined;
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
