import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '@src/components/core/backButton';
import AddAssetCard from '@src/components/views/addAssetCard';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

type DocumentCreateProps = NativeStackScreenProps<PrivateStackParamsList, 'DocumentCreate'>

const DocumentCreateScreen: FC<DocumentCreateProps> = (props) => {
  const {navigation} = props;
  return (
    <SafeAreaView style={styles.container}>
        <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={['#2C86BF', '#2C86BF', '#8DC4E6']}
            style={styles.topSectionList}
        >
            <View style={styles.backToPrevious}>
                <BackButton
                    handlePress={() => navigation.navigate('Document')}
                />
            </View>

            <View style={styles.containerText}>
                <Text variant="headlineLarge" style={styles.textHeader}>
                    Add Asset Document No: 00004
                </Text>
                <Text variant="bodyLarge" style={styles.textDescription}>
                    Location:
                </Text>

            </View>
        </LinearGradient>

        <View style={styles.listSection}>
            <ScrollView>
                <Text variant="bodyLarge" style={styles.textTotalDocument}>
                    Total Document : 3
                </Text>
                <View style={styles.wrapDetailList}>
                        <AddAssetCard
                            imageSource={require('../../assets/images/img1.jpg')}
                            assetCode="RB0001"
                            assetName="Table"
                            assetStatus="ปกติ"
                            assetMovement="Normal"
                            assetDate="01/01/2567"

                        />

                        <AddAssetCard
                            imageSource={require('../../assets/images/img2.jpg')}
                            assetCode="RB0001"
                            assetName="Table"
                            assetStatus="ปกติ"
                            assetMovement="Normal"
                            assetDate="01/01/2567"

                        />

                        <AddAssetCard
                            imageSource={require('../../assets/images/img3.jpg')}
                            assetCode="RB0001"
                            assetName="Table"
                            assetStatus="ปกติ"
                            assetMovement="Normal"
                            assetDate="01/01/2567"

                        />
                        <TouchableOpacity style={styles.saveButton}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                </View>
            </ScrollView>
        </View>

    </SafeAreaView>
);
};
const styles = StyleSheet.create({
  container: {
      flex: 1
  },
  topSectionList: {
      height: hp('30%'),
      width: wp('100%'),
      position: 'absolute',
      display: 'flex'
  },
  backToPrevious: {
      marginVertical: 25,
      marginHorizontal: 15,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      alignSelf: 'stretch'
  },
  resetCancel: {
      position: 'absolute',
      right: 15,
      top: 30,
      borderWidth: 2,
      borderColor: '#F0787A',
      backgroundColor: theme.colors.white,
      borderRadius: 25,
      paddingVertical: 5,
      paddingHorizontal: 15
  },

  statusText: {
      color: '#FFFFFF'
  },
  containerText: {
      marginHorizontal: 20
  },
  textHeader: {
      color: '#FFFFFF',
      fontWeight: '700',
      marginBottom: 5
  },
  textDescription: {
      fontFamily: 'Sarabun-Regular',
      color: '#FFFFFF'
  },
  listSection: {
      flex: 1,
      height: hp('30%'),
      width: wp('100%'),
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: '50%'
  },
  wrapDetailList: {
      display: 'flex',
      alignItems: 'center',
      gap: 15,
      marginTop: 20,
      marginBottom: 5
  },

  textTotalDocument: {
      marginLeft: 20,
      marginTop: 20,
      fontWeight: '700',
      fontSize: 15
  },
  button: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0
  },

  saveButton: {
      backgroundColor: '#2983BC',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10
  },

  buttonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16
  }
});
export default DocumentCreateScreen;
