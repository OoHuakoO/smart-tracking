import { AssetDataForPassParamsDocumentCreate, SearchAsset } from './asset';
import { DocumentAssetData, SearchDocument } from './document';
import { AssetData, LocationData } from './downloadDB';
import { LocationReportData } from './report';

export type RootStackParamsList = {
    PrivateStack: undefined;
    PublicStack: undefined;
};

export type PublicStackParamsList = {
    Setting: undefined;
    Login: undefined;
    PasswordSetting: undefined;
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
    ReportSearch: {
        LocationData: LocationReportData;
        title: string;
    };
    LocationListReportAsset: {
        LocationData: LocationReportData;
        title?: string;
        assetSearch?: SearchAsset;
    };
    DocumentAssetDetail: {
        assetData: DocumentAssetData;
        routeBefore: string;
        onGoBack?: (assetData: AssetDataForPassParamsDocumentCreate) => void;
    };
    DocumentSearch: undefined;
    DocumentAssetSearch: undefined;
    DocumentAssetStatus: undefined;
    DocumentCreate: {
        codeFromAssetSearch?: string;
    };
    DocumentCreateSelectSearch: {
        assetSearch: SearchAsset;
    };
    DocumentCreateNewAsset: {
        code: string;
        onGoBack?: (assetData: AssetDataForPassParamsDocumentCreate) => void;
    };
    DocumentScanAsset: {
        onGoBack?: (code: string) => void;
    };
};
