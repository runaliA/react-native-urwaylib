import { NativeModules ,Platform } from 'react-native';
import sha256 from 'js-sha256';
import { useState,useEffect } from 'react';
import queryString from 'query-string';
import publicIP from 'react-native-public-ip';
import {Base64} from 'js-base64';
import { View,Modal ,StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const { Applepay } = NativeModules;
import { WebView } from 'react-native-webview';
import type { AndroidLayerType } from 'react-native-webview/lib/WebViewTypes';



const getApplePayToken = (merchantid : string,amount :  string,name: string,country:String,currency:String ) => {
  return new Promise((resolve, reject) => {
    Applepay.createApplePayToken(merchantid, amount, name ,country,currency, (err :  any, token:  AndroidLayerType) => {
      if (err) {
        reject(`Error coming from iOS: ${err}`);
      } else {
      //  console.log("Token " + token);
        resolve(token);
      }
    });
  });
};


export const useUrway =  async ( dataapplepay : any ) =>
{
  if (Platform.OS === 'android') {
    let respdata  = {
      'data': "Apple Pay not supported ",
      
    };
    return respdata;
} else {
   
  
//let appletoken = '';
//console.log("in UseUrway" + dataapplepay);

const reqparams:any  = (dataapplepay);
        const requestdata=JSON.parse(reqparams);
//console.log("in UseUrway props " + JSON.stringify(reqparams));

const txn_details = "" + requestdata.trackid + "|" + requestdata.terminalId + "|" + requestdata.password + "|" + requestdata.merchantkey + "|" + requestdata.amount +
"|" + requestdata.currency + "";
console.log("in Trxn 1 " + txn_details);

const hash = sha256.sha256(txn_details);

//let ipadd= await publicIpv4();

console.log('SHA-256 Hash in Apple Pay :', hash);

    let ipadd = '';
  
    publicIP()
    .then(ip => {
    ipadd = ip ;
    })
    .catch(error  => {
      console.log(error);
      // 'Unable to get IP address.'
    });
    //console.log("requestdata.trackId"+requestdata.trackid);
    try {
      const appletoken = await getApplePayToken(requestdata.merchantid,requestdata.amount,requestdata.store_name,requestdata.country,requestdata.currency);
    const paymentRequest = 
        {
          
          'terminalId': requestdata.terminalId,
          'trackid': requestdata.trackid,
          'action': "1",
          'merchantIp': ipadd,
          'password': requestdata.password,
          'amount': requestdata.amount,
          'requestHash': hash,
          'country': requestdata.country,
          'currency': requestdata.currency,
          'customerIp': ipadd,
          'applepayId': 'applepay',
          'udf1': null,
          'udf2': null,
          'udf3': null,
          'udf4': 'ApplePay',
          'udf5': appletoken
        };
        console.log("Apple Pay Request "+ JSON.stringify(paymentRequest));
       
          const response = await fetch(requestdata.requestUrl, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentRequest)
          });
          const result =  await response.json();
            return(result);
          
        } catch (e) {
          let respdata  = {
            'data': 'Something went wrong while sending the request',
            
          };
          return respdata ;
        }

      }


}

export const PluginApp = ( props: {
        onCloseModal( data: string): unknown ;  data: string | null | undefined ; onfromApplePay: boolean  }) =>
      {
        const [modalVisible, setModalVisible] = useState(true);
        const [urlddata, seturlDData ] = useState("");
      
        const reqparams:any  =(props.data);
        const requestdata=JSON.parse(reqparams);
        let urldata = '';
        let navUrl = ''; 
        let devicejson ={};
      
      
   
        //Creating Request Hash
        
     

      useEffect(() => 
      {
        function goForFetch() 
       {
          const txn_details = "" + requestdata.trackid + "|" + requestdata.terminalId + "|" + requestdata.password + "|" + requestdata.merchantkey + "|" + requestdata.amount +
          "|" + requestdata.currency + "";
          const hash = sha256.sha256(txn_details);


publicIP()
.then(async ip => {
  //console.log(ip);
//ipadd = ip ;
                 
          let fields = {};
          let appresp = '';
        
        let appName = DeviceInfo.getSystemName();
        console.log("appName : "+appName);
          devicejson = {
                                 'pluginName': "React Native ",
                                 'pluginVersion': '1.0.2',
                                 'pluginPlatform': DeviceInfo.getDeviceType(),
                                 'deviceModel': DeviceInfo.getModel(),
                                 'devicePlatform': DeviceInfo.getSystemName(),
                                 'deviceOSVersion': DeviceInfo.getSystemVersion(),
                       };
                           
                           
    const json_devicedata = JSON.stringify(devicejson);

           if(requestdata.action === '1' || requestdata.action === '4'){
               fields = {
                 'trackid': requestdata.trackid,
                 'transid': "",
                 'terminalId': requestdata.terminalId,
                 'customerEmail': requestdata.email,
                 'customerName': requestdata.first_name + " " + requestdata.last_name,
                 "cardHolderName": requestdata.first_name + " " + requestdata.last_name,
                 'action': requestdata.action,
                
                 'merchantIp':ip,
                 'password': requestdata.password,
                 'currency':  requestdata.currency,
                 'country': requestdata.country,
                 'amount': requestdata.amount,
                 'udf2': requestdata.udf2,
                 'udf3': requestdata.udf3,
                 'customerIp': ip,
                 'udf1': "",
                 'udf5': "",
                 'udf4': "",
                 'metaData': requestdata.metadata,
                 'tokenizationType': 0,
                 'cardToken':requestdata.cardtoken,
                 'requestHash': hash,
                 'deviceInfo' : json_devicedata
             };
            }
            
            else if(requestdata.action === '12'){
  
          
              if (requestdata.tokenizationType == 'A') {
                fields = {
                    'trackid': requestdata.trackid,
                    'transid': requestdata.trackid,
                    'terminalId': requestdata.terminalId,
                   
                    'customerEmail': requestdata.email,
                    'customerName': requestdata.first_name + " " + requestdata.last_name,
                    'action': requestdata.action,
                    'merchantIp': ip,
                    'password': requestdata.password,
                    'currency': requestdata.currency,
                    'country': requestdata.country,
                    'amount': requestdata.amount,
                    'udf2':  requestdata.udf2,
                    'udf3': requestdata.udf3,
                    'customerIp':ip,
                    'udf1': "",
                    'udf5': "",
                    'udf4': "",
                    'tokenizationType': 0,
                    'cardToken': requestdata.cardtoken,
                    'tokenOperation':requestdata.tokenizationType,
                    'metaData': requestdata.metadata,
                    'requestHash': hash,
                    'deviceInfo' : json_devicedata
                }
            }
           
           
            else
           {
              fields = {
                'trackid': requestdata.trackid,
                'transid': requestdata.transid,
                'terminalId': requestdata.terminalId,
                'customerEmail': requestdata.email,
                'customerName': requestdata.first_name + " " + requestdata.last_name,
                "cardHolderName": requestdata.first_name + " " + requestdata.last_name,
                'action': requestdata.action,
                
                'merchantIp':ip,
                'password': requestdata.password,
                'currency':  requestdata.currency,
                'country': requestdata.country,
                'amount': requestdata.amount,
                'udf2': requestdata.udf2,
                'udf3': requestdata.udf3,
                'customerIp': ip,
                'udf1': "",
                'udf5': "",
                'udf4': "",
                'metaData': requestdata.metadata,
                'tokenizationType': 0,
                'cardToken': requestdata.cardtoken,
            'tokenOperation': requestdata.tokenizationType,
                'requestHash': hash,
                'deviceInfo' : json_devicedata
            };
           }
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
              })
              .then(response => {
                // Check if the response is ok (status code 200-299)
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                // Parse the response body as JSON
                return response.json();
              })
              .then(data => {
                // Handle the parsed JSON data
                //console.log('Response JSON:', data);
                appresp = JSON.stringify(data); 
                //console.error('Response data:1ss', appresp);

              })
              .catch(error => {
                // Handle errors
                console.error('Error fetching data:', error);
              });
             //  const result = await response.json();
             // setFe(result);

             //sssconsole.error('Response data:', appresp);
             const repdata=JSON.parse(appresp);
                 let urldecode = repdata;
                 //console.log("RESPONSE TEST " + urldecode);
                 ress = JSON.stringify(urldecode);
                //console.log("RESPONSE TEST  ress - " + ress);
                if ('targetUrl' in repdata && repdata['targetUrl'] !== null) 
                  {
                 //console.log("Target URL available");
                 if (repdata['payid'] != undefined)  
                 {
                    
                      let url = "";
                      if (repdata['targetUrl'].includes('?paymentId=')) {
                      url = repdata['targetUrl'] + repdata['payid'];
                      } else {
                      url = repdata['targetUrl'] + "?paymentid=" + repdata['payid'];
                       }
                      //console.log(" URL "+url);
                      urldata = url;
                     // console.log(" urldata: "+urldata);
                                      
                      const createJson = JSON.stringify({
                      'hostedurl': url,
                        });
                     seturlDData(urldata);
                          
                     console.log("Create JSon "+createJson);
                     // ress = createJson;
                    //  setresponseData(ress)
                     
                 
                 
                 }
                 else
                 {
         
                   onModalClose(ress); 
                 }
                 }
                 else {
                 //console.log("Direct Api  Response ");
                  console.log(" Api  Response " + ress);
                  onModalClose(ress); 
                }
               
                  
                 // console.log(" ++ "+ress);
                  return ress;
                });
           
             }
              goForFetch();  // Call the async function
                 },   []); 
   
    
      
  
     
  
  
  
        let dataM :any;
        const onNavigationStateChange1 = (navState: any)  => {
  
          if (navUrl !==  navState['url']) { 
            // let xyz = navState[url]
            navUrl  = navState['url'];
          //  console.log(" Nav URL "+navUrl);
            const responseObject = queryString.parse(navUrl);
           //  console.log("StringSplit Code "+responseObject['Result']);
            //  let queries = queryString.parse(this.props.location.search)
            if (responseObject['Result'] != "" &&  ( responseObject['Result'] === "Successful" || responseObject['Result'] === "Failure" || responseObject['Result'] === "UnSuccessful" ) )
            {
            //  console.log("RESULT "+ responseObject['Result']);
              if(responseObject['metaData'] != "" || responseObject['metaData'] != null )
              {
                    dataM = responseObject['metaData'];
  
                  console.log(" dataM "+dataM);
                
                }
            var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params :any= {},
            match:any;
          while (match = regex.exec(navUrl)) 
          {
          //  console.log("RESPONSE params[match[1]] " +match[1]);
           // console.log("RESPONSE match[2] " +match[2]);
  
            if(match[1] == "metaData" && (match[2] != null || match[2] != ''))
            {
            //  console.log("RESPONSE match[2] METADATA  " +match[2]);
             var decryptdata=Base64.decode(match[2]);
             console.log("decrypt METADATA "+ decryptdata);
             params[match[1]] =decryptdata;
             //params[match[1]]=match[2];
            }
  
            else
            {
              params[match[1]] = match[2];
            }
          }
      
          onModalClose(JSON.stringify(params));
      
        }
           
          }
          else{
          }
        };
        
        // const handleRespdata=(e) => onModalClose(e);
  
        const onModalClose = (respparam : string) => {
       
          if(respparam === "" || respparam === "\"\"" )
          {
            //console.log("response1 "+ responsedata);s
            setModalVisible(modalVisible);
          }
          else{
          // console.log("response2 "+ responsedata);
            setModalVisible(!modalVisible);
            props.onCloseModal( respparam);
          }
       
        };
      
    console.log( "urldata"+ urldata);
         return (
        
          <View style={styles.container} >
             {/* <Text>Hi there </Text > */}
         
             <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            
            onRequestClose={() => {
             
              setModalVisible(!modalVisible);
          }}>
            
  
            {/* <Button title='close' onPress={e => onModalClose(e)}></Button> */}
  
           {/* <Text style={styles.paragraph}>{props.data}</Text> */}             
          <WebView style={styles.modalView} 
              source = {{ uri:urlddata }}
              onNavigationStateChange = { onNavigationStateChange1 }
             
            />
            {/* </View> */}
          </Modal>
          </View>
         );  
        }
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
      
          width:'90%',
          shadowColor: "#000",
         
        
        },
        paragraph: {
          margin: 24,
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
        },
        modalContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
       
        modalText: {
          fontSize: 18,
          marginBottom: 15,
          textAlign: 'center',
        },
      }); 

    
    
