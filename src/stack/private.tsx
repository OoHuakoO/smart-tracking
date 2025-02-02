import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssetDetail from '@src/screens/assetDetail';
import AssetSearch from '@src/screens/assetSearch';
import AssetScreen from '@src/screens/assets';
import BranchSearchScreen from '@src/screens/branchSelect';
import Document from '@src/screens/document';
import DocumentAssetDetail from '@src/screens/documentAssetDetail';
import DocumentAssetSearch from '@src/screens/documentAssetSearch';
import DocumentAssetStatus from '@src/screens/documentAssetStatus';
import DocumentCreate from '@src/screens/documentCreate';
import DocumentCreateNewAsset from '@src/screens/documentCreateNewAsset';
import DocumentCreateSearch from '@src/screens/documentCreateSelectSearch';
import DocumentScanAsset from '@src/screens/documentScanAsset';
import DocumentSearch from '@src/screens/documentSearch';
import Home from '@src/screens/home';
import Location from '@src/screens/location';
import LocationAssetSearch from '@src/screens/locationAssetSearch';
import LocationListAsset from '@src/screens/locationListAsset';
import LocationListReportAsset from '@src/screens/locationListReportAsset';
import Report from '@src/screens/report';
import ReportAssetData from '@src/screens/reportAssetData';
import ReportSearch from '@src/screens/reportSearch';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { memo } from 'react';

const Stack = createNativeStackNavigator<PrivateStackParamsList>();
const PrivateStack = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                options={{
                    headerShown: false
                }}
                component={Home}
            />
            <Stack.Screen
                name="Assets"
                options={{
                    headerShown: false
                }}
                component={AssetScreen}
            />
            <Stack.Screen
                name="AssetDetail"
                options={{
                    headerShown: false
                }}
                component={AssetDetail}
            />
            <Stack.Screen
                name="AssetSearch"
                options={{
                    headerShown: false
                }}
                component={AssetSearch}
            />
            <Stack.Screen
                name="Location"
                options={{
                    headerShown: false
                }}
                component={Location}
            />
            <Stack.Screen
                name="Document"
                options={{
                    headerShown: false
                }}
                component={Document}
            />
            <Stack.Screen
                name="DocumentAssetDetail"
                options={{
                    headerShown: false
                }}
                component={DocumentAssetDetail}
            />
            <Stack.Screen
                name="DocumentSearch"
                options={{
                    headerShown: false
                }}
                component={DocumentSearch}
            />
            <Stack.Screen
                name="DocumentAssetSearch"
                options={{
                    headerShown: false
                }}
                component={DocumentAssetSearch}
            />
            <Stack.Screen
                name="LocationListAsset"
                options={{
                    headerShown: false
                }}
                component={LocationListAsset}
            />
            <Stack.Screen
                name="LocationAssetSearch"
                options={{
                    headerShown: false
                }}
                component={LocationAssetSearch}
            />
            <Stack.Screen
                name="DocumentAssetStatus"
                options={{
                    headerShown: false
                }}
                component={DocumentAssetStatus}
            />
            <Stack.Screen
                name="Report"
                options={{
                    headerShown: false
                }}
                component={Report}
            />

            <Stack.Screen
                name="ReportAssetData"
                options={{
                    headerShown: false
                }}
                component={ReportAssetData}
            />

            <Stack.Screen
                name="ReportSearch"
                options={{
                    headerShown: false
                }}
                component={ReportSearch}
            />

            <Stack.Screen
                name="LocationListReportAsset"
                options={{
                    headerShown: false
                }}
                component={LocationListReportAsset}
            />

            <Stack.Screen
                name="DocumentCreate"
                options={{
                    headerShown: false
                }}
                component={DocumentCreate}
            />

            <Stack.Screen
                name="DocumentCreateSelectSearch"
                options={{
                    headerShown: false
                }}
                component={DocumentCreateSearch}
            />

            <Stack.Screen
                name="DocumentCreateNewAsset"
                options={{
                    headerShown: false
                }}
                component={DocumentCreateNewAsset}
            />
            <Stack.Screen
                name="DocumentScanAsset"
                options={{
                    headerShown: false
                }}
                component={DocumentScanAsset}
            />
            <Stack.Screen
                name="BranchSelectScreen"
                options={{
                    headerShown: false
                }}
                component={BranchSearchScreen}
            />
        </Stack.Navigator>
    );
};

export default memo(PrivateStack);
