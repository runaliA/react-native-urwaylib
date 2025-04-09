"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _reactNative = require("react-native");
var _reactNativeWebview = require("react-native-webview");
var _jsxRuntime = require("react/jsx-runtime");
const WebViewScreen = ({}) => {
  //const url   = "https://www.google.com";
  let urllink = 'https://www.google.com';
  const webViewRef = (0, _react.useRef)(null);
  const handleNavigationChange = () => {
    console.log();
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: styles.container,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeWebview.WebView, {
      ref: webViewRef,
      source: {
        uri: urllink
      },
      onNavigationStateChange: handleNavigationChange // Add this prop
    })
  });
};
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});
var _default = exports.default = WebViewScreen;
//# sourceMappingURL=webviewscreen.js.map