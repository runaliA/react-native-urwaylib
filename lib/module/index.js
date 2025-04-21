"use strict";

import { StyleSheet, View, SafeAreaView, Text, Alert } from 'react-native';
import { NativeModules, Platform } from 'react-native';
const {
  Applepay
} = NativeModules;
// import CustomWebView from './CustomWebView';
import WebView from 'react-native-webview';
import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import DeviceInfo from 'react-native-device-info';
import queryString from 'query-string';
import { Base64 } from 'js-base64';
import { jsx as _jsx } from "react/jsx-runtime";
const HostedPlugin = ({
  data,
  onClose
}) => {
  const [paymentResult, setPaymentResult] = useState(null); // To store the result of the payment request
  const [loading, setLoading] = useState(true); // To manage loading state
  const [showWebView, setShowWebView] = useState(true);
  const [strpaymenturl, setStrPaymentUrl] = useState("");
  const reqparams = data;
  const requestdata = JSON.parse(reqparams);
  const [publicIp, setpublicIp] = useState("");
  const [ispublicipfetched, setIsPublicIpFetched] = useState(false);
  useEffect(() => {
    const fetchPublicIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const result = await response.json();
        console.log("Public IP in own method:", result.ip);
        setpublicIp(result.ip);
        setIsPublicIpFetched(true);
      } catch (e) {
        console.log('Something went wrong while fetching the public IP');
      }
    };
    fetchPublicIp();
  }, []);
  useEffect(() => {
    if (ispublicipfetched) {
      console.log("Public IP in useEffect:", publicIp);
      fetchPayment();
    }
  }, [publicIp, ispublicipfetched]);
  const fetchPayment = async () => {
    console.log("DATA " + data);
    console.log("Request For API CALL " + JSON.stringify(requestdata));
    const txn_details = "" + requestdata.trackid + "|" + requestdata.terminalId + "|" + requestdata.password + "|" + requestdata.merchantkey + "|" + requestdata.amount + "|" + requestdata.currency + "";
    const hash = CryptoJS.SHA256(txn_details).toString(CryptoJS.enc.Hex);
    console.log('SHA-256 Hash:', hash);
    const appName = DeviceInfo.getSystemName();
    console.log("appName : " + appName);
    const validatePaymentRequest = paymentRequest => {
      console.log("In validatePaymentRequest" + JSON.stringify(paymentRequest));
      if (!paymentRequest) {
        console.error("Payment request is null or undefined");
        return false;
      } else if (!paymentRequest.amount || paymentRequest.amount <= 0) {
        console.error("Invalid payment amount");
        return false;
      } else if (!paymentRequest.currency) {
        console.error("Currency is required");
        return false;
      } else if (!paymentRequest.action) {
        Alert.alert('Error', 'Payment Type is required');
        return false;
      }
      // Add more validations as needed
      return true;
    };
    const handlePayment = paymentRequest => {
      if (validatePaymentRequest(paymentRequest)) {
        // Proceed with payment processing
        console.log("Payment request is valid");
      } else {
        // Handle invalid payment request
        Alert.alert('Error', 'Payment Request is invalid');
        if (showWebView) {
          // Send the result back to the parent app
          onClose("Payment Request is invalid");
          // Hide WebView after sending result
          setShowWebView(false);
        }
      }
    };
    const formattedDeviceInfo = JSON.stringify({
      'pluginName': "React Native ",
      'pluginVersion': '1.0.3',
      'pluginPlatform': DeviceInfo.getDeviceType(),
      'deviceModel': DeviceInfo.getModel(),
      'devicePlatform': appName // get from device or hardcoded
    });
    const formatedmetadata = JSON.stringify(requestdata.metadata);
    // console.log("Device Info", formattedDeviceInfo);
    console.log("formatedmetadata ", formatedmetadata);
    console.log("signature", hash);
    console.log("Public IP  method:", publicIp);
    // const json_devicedata = JSON.stringify(devicejson);
    const paymentRequest = {
      terminalId: requestdata.terminalId,
      action: requestdata.action,
      merchantIp: publicIp || '0.0.0.0',
      password: requestdata.password,
      amount: requestdata.amount,
      currency: requestdata.currency,
      requestHash: hash,
      country: requestdata.country,
      trackid: requestdata.trackid,
      transid: requestdata.transactionId,
      udf1: "",
      udf5: "",
      udf4: "",
      cardToken: requestdata.cardtoken,
      customerIp: publicIp || '0.0.0.0',
      metaData: requestdata.metadata,
      tokenOperation: requestdata.tokenizationType,
      deviceInfo: formattedDeviceInfo
    };
    handlePayment(paymentRequest);
    console.log("  REQUEST " + JSON.stringify(paymentRequest));
    console.log("  REQUEST URL " + requestdata.requestUrl);
    let requrl = requestdata.requestUrl;
    try {
      const response = await fetch(requrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentRequest)
      });
      const result = await response.json();
      // console.log("RESPONSE", result);
      // console.log("REQUEST", JSON.stringify(paymentRequest));
      setPaymentResult(result);
    } catch (e) {
      console.log('Something went wrong while sending the request');
      Alert.alert('Something went wrong while sending the request');
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  // Once we have the API result, call the onClose callback and hide the WebView
  useEffect(() => {
    if (paymentResult) {
      const dataRequest = paymentResult;
      console.log(" in useeffect " + dataRequest);
      if ('targetUrl' in dataRequest && dataRequest['targetUrl'] !== null) {
        const linkUrl = dataRequest.targetUrl;
        const transactionId = dataRequest.payid;
        let finalUrl = '';
        if (linkUrl.includes('?paymentid=')) {
          finalUrl = linkUrl + transactionId;
        } else {
          finalUrl = linkUrl + '?paymentid=' + transactionId;
        }
        console.log(finalUrl);
        setStrPaymentUrl(finalUrl);

        // console.log(linkUrl+"?paymentid="+transactionId);
        // setStrPaymentUrl(linkUrl+"?paymentid="+transactionId)

        console.log("Link URL:", linkUrl);
        console.log("Transaction ID:", transactionId);
        console.log("strpaymenturl :", strpaymenturl);
      } else {
        console.log("PAYMENT RESULT in else " + paymentResult);
        if (showWebView) {
          // Send the result back to the parent app
          onClose(JSON.stringify(paymentResult));
          // Hide WebView after sending result
          setShowWebView(false);
        }
      }
    }
  }, [paymentResult, onClose]);
  if (loading) {
    return /*#__PURE__*/_jsx(SafeAreaView, {
      children: /*#__PURE__*/_jsx(View, {
        children: /*#__PURE__*/_jsx(Text, {
          children: "Loading..."
        })
      })
    });
  }
  return /*#__PURE__*/_jsx(SafeAreaView, {
    style: {
      flex: 1,
      backgroundColor: '#f0f0f6'
    },
    children: showWebView && /*#__PURE__*/_jsx(View, {
      style: styles.webViewContainer,
      children: /*#__PURE__*/_jsx(WebView, {
        source: {
          uri: strpaymenturl
        },
        javaScriptEnabled: true,
        domStorageEnabled: true,
        useWebKit: true,
        originWhitelist: ['*'],
        mixedContentMode: "always",
        style: {
          flex: 1
        },
        onLoadStart: () => console.log('✅ WebView load started'),
        onLoadEnd: () => console.log('✅ WebView load finished'),
        onError: e => {
          console.error('❌ WebView error: ', e.nativeEvent);
        },
        onHttpError: e => {
          console.error('❌ WebView HTTP error: ', e.nativeEvent);
        },
        onNavigationStateChange: navState => {
          let respMetaData;
          //  setCurrentUrl(navState.url); // Update the URL as it changes
          console.log("Navigated to:", navState.url);
          const navUrl = navState['url'];
          const responseObject = queryString.parse(navState.url);
          if (responseObject['Result'] != "" && (responseObject['Result'] === "Successful" || responseObject['Result'] === "Failure" || responseObject['Result'] === "UnSuccessful")) {
            console.log("in Data " + navState.url);
            if (responseObject['metaData'] != "" || responseObject['metaData'] != null) {
              respMetaData = responseObject['metaData'];
              console.log(" MetaData Matched " + respMetaData);
            }
            var regex = /[?&]([^=#]+)=([^&#]*)/g,
              params = {},
              match;
            while (match = regex.exec(navUrl)) {
              //  console.log("RESPONSE params[match[1]] " +match[1]);
              // console.log("RESPONSE match[2] " +match[2]);

              if (match[1] == "metaData" && (match[2] != null || match[2] != '')) {
                //  console.log("RESPONSE match[2] METADATA  " +match[2]);
                var decryptdata = Base64.decode(match[2]);
                console.log("decrypt METADATA " + decryptdata);
                params[match[1]] = decryptdata;
                //params[match[1]]=match[2];
              } else {
                params[match[1]] = match[2];
              }
              console.log("RESPONSE   " + JSON.stringify(params));
              onClose(JSON.stringify(params));
            }
          }
        }
      })
    })
  });
};
// const decryptAES256ECB = (ciphertext :  string , secretKey : any) => {
//   try {
//       // Decode the Base64 string
//       //const decodedString = CryptoJS.enc.Base64.parse(ciphertext);
//       //console.log(" iN ECB "+ ciphertext);
//       //Alert.alert('iN ECB', ciphertext);
//       // Create the decryption parameters
//       const key = CryptoJS.enc.Hex.parse(secretKey);

//       // Decrypt the ciphertext
//       const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7,
//       });

//     // Convert decrypted data to UTF-8
//      const decryptedText = CryptoJS.enc.Utf8.stringify(decrypted);
//     Alert.alert('Decryption TEXT', decryptedText);
//     // Check if the decryption was successful
//     if (!decryptedText) {
//       throw new Error(
//         'Decryption resulted in an empty string. Invalid key or data.'
//       );
//     }
//     return decryptedText;
//   } 
//   catch (error :  any) 
//   {
//     console.error('Decryption Error:', error.message);
//     Alert.alert('Decryption Error', error.message); // Show an alert on error
//     return null;
//   }
// };
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  webViewContainer: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  btnContainer: {
    flex: 1
  },
  urlContainer: {
    padding: 10,
    backgroundColor: '#f4f4f4'
  }
});
const ApplePayComponent = ({
  data,
  onClose
}) => {
  useEffect(() => {
    //First create Applepay session

    const processApplePay = async () => {
      Alert.alert('Apple Pay Amount ', JSON.stringify(data));
      if (Platform.OS === 'android') {
        throw new Error('Apple Pay is not supported on Android devices');
      }
      Applepay.createApplePayToken("merchant.sa.urwayphp", "1.00", "label", "SA", "SAR", async (err, token) => {
        if (err) {
          Alert.alert('Error', `${err}`, [{
            text: 'ok',
            style: 'default'
          }]);
          onClose(err);
        } else {
          Alert.alert('Apple Pay Token', `${token}`, [{
            text: 'ok',
            style: 'default'
          }]);
          onClose(token); // Send the API response back to the parent
        }
      });
      // try {
      //   const requestData = JSON.parse(data || '{}');
      //   const response = await fetch('https://your-api-endpoint.com/applepay', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(requestData),
      //   });

      //   if (!response.ok) {
      //     throw new Error('Network response was not ok');
      //   }

      //   const result = await response.json();
      //   onClose(result); // Send the API response back to the parent
      // } catch (error) {
      //   console.error('Error processing Apple Pay:', error);
      //   Alert.alert('Error', 'Failed to process Apple Pay');
      //   onClose({ error: 'Failed to process Apple Pay' }); // Send the error back to the parent
      // }
    };
    processApplePay();
  }, [data, onClose]);
  return null; // No UI to render
};
export { HostedPlugin, ApplePayComponent };
//# sourceMappingURL=index.js.map