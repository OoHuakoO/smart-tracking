import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

type Props = {
  goBack: () => void,
};

const BackButton = ({goBack}: Props) => (
  <TouchableOpacity onPress={goBack} style={styles.container} />
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 10,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default memo(BackButton);
