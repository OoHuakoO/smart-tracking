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
    DocumentAssetDetail: {
        assetData: DocumentAssetData;
        routeBefore: string;
        onGoBack?: (assetData: AssetDataForPassParamsDocumentCreate) => void;
    };
    DocumentSearch: undefined;
    DocumentAssetSearch: undefined;
    DocumentAssetStatus: {
        isReFresh?: boolean;
    };
    DocumentCreate: {
        codeFromAssetSearch?: string;
    };
    DocumentCreateSelectSearch: {
        assetSearch: SearchAsset;
    };
    DocumentCreateAsset: {
        code: string;
        onGoBack?: (assetData: AssetDataForPassParamsDocumentCreate) => void;
    };
};
