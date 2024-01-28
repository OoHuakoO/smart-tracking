import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC } from 'react';

type AssetScreenProps = NativeStackScreenProps<PrivateStackParamsList, 'Asset'>;

const Asset: FC<AssetScreenProps> = () => {
    return <div>Asset</div>;
};

export default Asset;
