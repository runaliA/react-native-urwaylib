"use strict";

import { NativeModules } from 'react-native';
//import { config } from '../../../config';
//import { Alert ,View,Text,Modal,Button ,StyleSheet } from 'react-native';
import sha256 from 'js-sha256';
import { useState, useEffect } from 'react';
import queryString from 'query-string';
import publicIP from 'react-native-public-ip';

//import { publicIpv4 } from 'public-ip';
import { View, Modal, StyleSheet } from 'react-native';
const {
  Applepay
} = NativeModules;
//import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { jsx as _jsx } from "react/jsx-runtime";
const getApplePayToken = () => {
  return new Promise((resolve, reject) => {
    Applepay.createApplePayToken('merchant.sa.urwayphp', '1', 'Runali A', (err, token) => {
      if (err) {
        reject(`Error coming from iOS: ${err}`);
      } else {
        console.log("Token " + token);
        resolve(token);
      }
    });
  });
};
export const useUrway = async dataapplepay => {
  //let appletoken = '';
  console.log("in UseUrway" + dataapplepay);
  const reqparams = dataapplepay;
  const requestdata = JSON.parse(reqparams);
  console.log("in UseUrway props " + JSON.stringify(reqparams));
  const txn_details = "" + requestdata.trackid + "|" + requestdata.terminalId + "|" + requestdata.password + "|" + requestdata.merchantkey + "|" + requestdata.amount + "|" + requestdata.currency + "";
  const hash = sha256.sha256(txn_details);

  //let ipadd= await publicIpv4();

  console.log('SHA-256 Hash in Apple Pay :', hash);
  // Alert.alert('Error', 'Transaction was coming from a simulator', [{
  //        text: 'ok',
  //             style: 'default'
  //      }]);

  //  Applepay.createApplePayToken('merchant.sa.urwayphp', '1', 'Runali A', async (err: any , token : any) => {
  //   if (err) {
  //     Alert.alert('Error', `${err}`, [{
  //       text: 'ok',
  //       style: 'default'
  //     }]);

  //     return(`Error coming from iOS: ${err}`);
  //   }
  //   else
  //   {
  //     console.log("Token " + token);
  //     appletoken = token;
  //     return  appletoken;
  //   }

  // });
  let ipadd = '';
  console.log('SHA-256 Hash:', hash);
  console.log('IP Add:', ipadd);
  publicIP().then(ip => {
    console.log(ip);
    ipadd = ip;
    // '47.122.71.234'
  }).catch(error => {
    console.log(error);
    // 'Unable to get IP address.'
  });
  try {
    const appletoken = await getApplePayToken();
    const paymentRequest = {
      trackid: requestdata.trackId,
      terminalId: requestdata.terminalId,
      action: requestdata.action,
      merchantIp: ipadd,
      password: requestdata.password,
      amount: requestdata.amount,
      requestHash: hash,
      country: requestdata.country,
      currency: requestdata.currency,
      customerIp: ipadd,
      applepayId: 'applepay',
      udf1: null,
      udf2: null,
      udf3: null,
      udf4: 'ApplePay',
      udf5: appletoken
    };
    console.log("Apple Pay Request " + JSON.stringify(paymentRequest));
    const response = await fetch(requestdata.requestUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentRequest)
    });
    const result = await response.json();
    // setFe(result);
    console.log("In Apple Pay Token" + JSON.stringify(result));
    return result;
  } catch (e) {
    return 'Something went wrong while sending the request';
  }
};
export const PluginApp = props => {
  const [modalVisible, setModalVisible] = useState(true);
  const [urlddata, seturlDData] = useState("");
  const [responsedata, setresponseData] = useState("");
  // const [merchantip, setmerIPData ] = useState("");
  // const [ressHash, setresphash ] = useState(null);
  const reqparams = props.data;
  const requestdata = JSON.parse(reqparams);
  let urldata = '';
  let navUrl = '';
  let devicejson = {};
  // const reqparams = JSON.stringify({"trackid":"170735576","transid":"170735576","terminalId":"recterm","customerEmail":"pooja.thorat@concertosoft.com","address":"Mahape","city":"Mumbai","state":"Maharashtra","zipCode":"400071","customerName":"pooja thorat","cardHolderName":"pooja thorat","action":"1","instrumentType":"DEFAULT","merchantIp":"10.10.11.76","password":"password","currency":"SAR","country":"IN","amount":"1.00","udf2":"","udf3":"","udf1":"","udf5":"","udf4":"","requestHash":"716a83741f3bbbbe01209cd407da9f903084e66ca7af1932c35d6c99c5ab6d80","metaData":"{entry:entry1,entry2:entry2}"}
  // );

  //Creating Request Hash

  // useEffect(() => {

  // }, [ressHash]);

  useEffect(() => {
    async function goForFetch() {
      const txn_details = "" + requestdata.trackid + "|" + requestdata.terminalId + "|" + requestdata.password + "|" + requestdata.merchantkey + "|" + requestdata.amount + "|" + requestdata.currency + "";
      const hash = sha256.sha256(txn_details);

      //let ipadd= await publicIpv4();
      let ipadd = '';
      console.log('SHA-256 Hash:', hash);
      console.log('IP Add:', ipadd);
      publicIP().then(ip => {
        console.log(ip);
        ipadd = ip;
        // '47.122.71.234'
      }).catch(error => {
        console.log(error);
        // 'Unable to get IP address.'
      });
      let fields = {};
      let appresp = '';
      // let hasshh =  ressHash;
      console.log("hash : " + hash);
      // let appName = DeviceInfo.getSystemName();

      // if(Platform === 'android')
      // {

      devicejson = {
        'pluginName': "React Native ",
        'pluginVersion': '3.0',
        'pluginPlatform': "DeviceInfo.getDeviceType()",
        'deviceModel': "DeviceInfo.getModel()",
        'devicePlatform': "DeviceInfo.getSystemName()",
        'deviceOSVersion': "DeviceInfo.getSystemVersion()"
      };
      // }
      // else{
      //   devicejson = {
      //     'pluginName': "React Native ",
      //     'pluginVersion': '3.0',
      //     'pluginPlatform': "DeviceInfo.getDeviceType()",
      //     'deviceModel': "DeviceInfo.getModel()",
      //     'devicePlatform': "DeviceInfo.getSystemName()",
      //     'deviceOSVersion': 'DeviceInfo.getSystemVersion()',
      // };
      // }
      //   'transDate':moment().format("DD-MMM-YYYY"),  use this above
      const json_devicedata = JSON.stringify(devicejson);
      console.log("Device INFo : " + json_devicedata);
      console.log("requestdata.action : " + requestdata.action);
      if (requestdata.action === '1') {
        fields = {
          'trackid': requestdata.trackid,
          'transid': "",
          'terminalId': requestdata.terminalId,
          'customerEmail': requestdata.email,
          'customerName': requestdata.first_name + " " + requestdata.last_name,
          "cardHolderName": requestdata.first_name + " " + requestdata.last_name,
          'action': requestdata.action,
          'merchantIp': ipadd,
          'password': requestdata.password,
          'currency': requestdata.currency,
          'country': requestdata.country,
          'amount': requestdata.amount,
          'udf2': requestdata.udf2,
          'udf3': requestdata.udf3,
          'customerIp': ipadd,
          'udf1': "",
          'udf5': "",
          'udf4': "",
          'metaData': requestdata.metadata,
          'tokenizationType': 0,
          'cardToken': requestdata.cardToken,
          'requestHash': hash,
          'deviceInfo': json_devicedata
        };
      } else if (requestdata.action === '12') {
        if (requestdata.tokenizationType == 'A') {
          fields = {
            'trackid': requestdata.trackid,
            'transid': requestdata.trackid,
            'terminalId': requestdata.terminalId,
            'customerEmail': requestdata.email,
            'customerName': requestdata.first_name + " " + requestdata.last_name,
            'action': requestdata.action,
            'merchantIp': ipadd,
            'password': requestdata.password,
            'currency': requestdata.currency,
            'country': requestdata.country,
            'amount': requestdata.amount,
            'udf2': requestdata.udf2,
            'udf3': requestdata.udf3,
            'customerIp': ipadd,
            'udf1': "",
            'udf5': "",
            'udf4': "",
            'tokenizationType': 0,
            'tokenOperation': requestdata.tokenizationType,
            'metaData': requestdata.metadata,
            'requestHash': hash,
            'deviceInfo': json_devicedata
          };
        }
      } else {
        fields = {
          'trackid': requestdata.trackid,
          'transid': requestdata.transid,
          'terminalId': requestdata.terminalId,
          'customerEmail': requestdata.email,
          'customerName': requestdata.first_name + " " + requestdata.last_name,
          "cardHolderName": requestdata.first_name + " " + requestdata.last_name,
          'action': requestdata.action,
          'merchantIp': ipadd,
          'password': requestdata.password,
          'currency': requestdata.currency,
          'country': requestdata.country,
          'amount': requestdata.amount,
          'udf2': requestdata.udf2,
          'udf3': requestdata.udf3,
          'customerIp': ipadd,
          'udf1': "",
          'udf5': "",
          'udf4': "",
          'metaData': requestdata.metadata,
          'tokenizationType': 0,
          'cardToken': requestdata.cardToken,
          'requestHash': hash,
          'deviceInfo': json_devicedata
        };
      }
      console.log("Request Param in go for Fetch " + JSON.stringify(fields));
      console.log("requestdata.requestUrl " + requestdata.requestUrl);
      let ress = "";
      //let apiresponse = '';

      await fetch(requestdata.requestUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
      }).then(response => {
        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Parse the response body as JSON
        return response.json();
      }).then(data => {
        // Handle the parsed JSON data
        console.log('Response JSON:', data);
        appresp = JSON.stringify(data);
      }).catch(error => {
        // Handle errors
        console.error('Error fetching data:', error);
      });
      //  const result = await response.json();
      // setFe(result);

      console.error('Response data:', appresp);
      const repdata = JSON.parse(appresp);
      let urldecode = repdata;
      console.log("RESPONSE TEST " + urldecode);
      ress = JSON.stringify(urldecode);
      console.log("RESPONSE TEST  ress - " + ress);
      if ('targetUrl' in repdata && repdata['targetUrl'] !== null) {
        console.log("Target URL available");
        if (repdata['payid'] != undefined) {
          let url = "";
          if (repdata['targetUrl'].includes('?paymentId=')) {
            url = repdata['targetUrl'] + repdata['payid'];
          } else {
            url = repdata['targetUrl'] + "?paymentid=" + repdata['payid'];
          }
          console.log(" URL " + url);
          urldata = url;
          console.log(" urldata: " + urldata);
          const createJson = JSON.stringify({
            'hostedurl': url
          });
          seturlDData(urldata);
          console.log("Create JSon " + createJson);
          // ress = createJson;
          //  setresponseData(ress)
        } else {
          console.log("Target URL not available");
          //    setresponseData(ress);

          onModalClose(ress);
        }
      }
      console.log(" ++ " + ress);
      return ress;
      // if(fromapple pay )
      // {
      //   gotobottomsheet()

      // }
      // els}e
      // {
    }
    goForFetch(); // Call the async function
  }, []);

  // console.log("Request" + reqparams);

  // const navigation=useNavigation();

  // React useeffect api call 
  // data read. url send to webview 
  //console.log("In Plugin");

  let dataM;
  const onNavigationStateChange1 = navState => {
    if (navUrl !== navState['url']) {
      // let xyz = navState[url]
      navUrl = navState['url'];
      console.log(" Nav URL " + navUrl);
      const responseObject = queryString.parse(navUrl);
      console.log("StringSplit Code " + responseObject['Result']);
      //  let queries = queryString.parse(this.props.location.search)
      if (responseObject['Result'] != "" && (responseObject['Result'] === "Successful" || responseObject['Result'] === "Failure" || responseObject['Result'] === "UnSuccessful")) {
        console.log("RESULT " + responseObject['Result']);
        if (responseObject['metaData'] != "" || responseObject['metaData'] != null) {
          dataM = responseObject['metaData'];
          console.log(" dataM " + dataM);
          // var decryptdata=Base64.decode(dataM);
          // console.log("decrypt"+ decryptdata);
        }
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match;
        while (match = regex.exec(navUrl)) {
          console.log("RESPONSE params[match[1]] " + match[1]);
          console.log("RESPONSE match[2] " + match[2]);
          if (match[1] == "metaData" && (match[2] != null || match[2] != '')) {
            console.log("RESPONSE match[2] METADATA  " + match[2]);
            // var decryptdata=Base64.decode(match[2]);
            //console.log("decrypt METADATA "+ decryptdata);
            // params[match[1]] =decryptdata;
            params[match[1]] = match[2];
          } else {
            params[match[1]] = match[2];
          }
        }
        console.log("RESPONSE Parames " + JSON.stringify(params));
        setresponseData(JSON.stringify(params));
        console.log("RESPONSE responsedata " + responsedata);
        onModalClose(JSON.stringify(params));
        // navigation.navigate('Receipt',{
        //   data:params
        // });
      }
    } else {
      console.log("RESULT is empty");
    }
  };

  // const handleRespdata=(e) => onModalClose(e);

  const onModalClose = respparam => {
    // let data1 = JSON.stringify(" {name: 'example from model', type: 'closed from child'} " );
    // let data = props.data;
    console.log("response1 " + respparam);
    //  for (var key in respparam) {
    //   console.log("key",key);
    //   if(key === "result"){

    //        console.log("resultttt",responsedata[key]);
    //   }
    // }
    if (respparam === "" || respparam === "\"\"") {
      //console.log("response1 "+ responsedata);
      setModalVisible(modalVisible);
    } else {
      console.log("response2 " + responsedata);
      setModalVisible(!modalVisible);
      props.onCloseModal(respparam);
    }
  };
  console.log("urldata" + urldata);
  return /*#__PURE__*/_jsx(View, {
    style: styles.container,
    children: /*#__PURE__*/_jsx(Modal, {
      animationType: "slide",
      transparent: false,
      visible: modalVisible,
      onRequestClose: () => {
        setModalVisible(!modalVisible);
      },
      children: /*#__PURE__*/_jsx(WebView, {
        style: styles.modalView,
        source: {
          uri: urlddata
        },
        onNavigationStateChange: onNavigationStateChange1
        // onLoadStart={(e) => {
        //   console.log("onLoad **");
        //   onModalClose(e , JSON.stringify(responsedata));
        // }}
      })
    })
  });
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    flex: 1,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
    borderRadius: 10,
    width: '90%',
    shadowColor: "#000"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center'
  }
});
//# sourceMappingURL=index_old.js.map