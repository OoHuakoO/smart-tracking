import { LocationData, ReportLocationParams } from './masterData';

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
    AssetDetail: undefined;
    AssetSearch: undefined;
    LocationListAsset: {
        LocationData: LocationData;
    };
    Report: undefined;
    ReportAssetData: {
        ReportAssetData: ReportLocationParams;
    };
    DocumentAssetStatus: undefined;
    LocationListReportAsset: undefined;
    DocumentCreate: undefined;
    DocumentCreateSearch: undefined;
};
