import { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';


const WebViewScreen = ( {} ) => {
   //const url   = "https://www.google.com";
  let urllink = 'https://www.google.com';
  const webViewRef = useRef(null);

  const handleNavigationChange = ( ) => {
  console.log();
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: urllink }}
        onNavigationStateChange={handleNavigationChange} // Add this prop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebViewScreen;
