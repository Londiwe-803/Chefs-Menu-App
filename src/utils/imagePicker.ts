import * as ImagePicker from 'react-native-image-picker';

export const pickImage = (): Promise<string | null> => {
  return new Promise((resolve) => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 800,
        maxWidth: 800,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          resolve(null);
        } else if (response.assets && response.assets[0]) {
          const imageUri = response.assets[0].uri;
          resolve(imageUri || null);
        } else {
          resolve(null);
        }
      }
    );
  });
};
