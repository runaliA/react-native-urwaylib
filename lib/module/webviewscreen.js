"use strict";

import { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { jsx as _jsx } from "react/jsx-runtime";
const WebViewScreen = ({}) => {
  //const url   = "https://www.google.com";
  let urllink = 'https://www.google.com';
  const webViewRef = useRef(null);
  const handleNavigationChange = () => {
    console.log();
  };
  return /*#__PURE__*/_jsx(View, {
    style: styles.container,
    children: /*#__PURE__*/_jsx(WebView, {
      ref: webViewRef,
      source: {
        uri: urllink
      },
      onNavigationStateChange: handleNavigationChange // Add this prop
    })
  });
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
export default WebViewScreen;
//# sourceMappingURL=webviewscreen.js.map