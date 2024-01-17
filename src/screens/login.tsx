import React, {FC, memo, useState} from 'react';
import {SafeAreaView} from 'react-native';

import Button from '@src/components/core/button';
import TextInput from '@src/components/core/textInput';
import {Navigation} from '@src/typings/navigattion';

interface LoginScreenProps {
  navigation: Navigation;
}

const LoginScreen: FC<LoginScreenProps> = () => {
  // const {navigation} = props;
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});

  return (
    <SafeAreaView>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({value: text, error: ''})}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({value: text, error: ''})}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <Button mode="contained">Login</Button>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   forgotPassword: {
//     width: '100%',
//     alignItems: 'flex-end',
//     marginBottom: 24,
//   },
//   row: {
//     flexDirection: 'row',
//     marginTop: 4,
//   },
//   label: {
//     color: theme.colors.secondary,
//   },
//   link: {
//     fontWeight: 'bold',
//     color: theme.colors.primary,
//   },
// });

export default memo(LoginScreen);
