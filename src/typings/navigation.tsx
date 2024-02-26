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
    Assets: undefined;
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
    DocumentAssetStatus: undefined;
    LocationListReportAsset: {
        LocationData: LocationData;
        title: string;
    };
    DocumentCreate: undefined;
    DocumentCreateSearch: undefined;
};
