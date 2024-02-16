import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssetDetail from '@src/screens/assetDetail';
import AssetSearch from '@src/screens/assetSearch';
import AssetScreen from '@src/screens/assets';
import Document from '@src/screens/document';
import DocumentAssetStatus from '@src/screens/documentAssetStatus';
import HomeScreen from '@src/screens/home';
import Location from '@src/screens/location';
import LocationListAsset from '@src/screens/locationListAsset';
import LocationListReportAsset from '@src/screens/locationListReportAsset';
import Report from '@src/screens/report';
import ReportAssetData from '@src/screens/reportAssetData';
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
                component={HomeScreen}
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
                name="LocationListAsset"
                options={{
                    headerShown: false
                }}
                component={LocationListAsset}
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
                name="LocationListReportAsset"
                options={{
                    headerShown: false
                }}
                component={LocationListReportAsset}
            />
        </Stack.Navigator>
    );
};

export default memo(PrivateStack);
