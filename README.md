# react-native-urwaylib

Urway React Native Plugin

## Installation

```sh
npm install react-native-urwaylib
```

## Usage


```js
import { HostedPlugin, ApplePayComponent } from 'react-native-urwaylib';

// ...Apple Pay Integration

const pay = useUrway(JSON.stringify(data));


// ...Purchase,Pre Auth,Tokenization Transaction Integration


{showWebView && (
    <View style = {styles.webViewContainer}>
     <HostedPlugin data={ appReq } onClose={ handlePaymentResult} />
    </View>
```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)


⚠️ This plugin supports only the Classic React Native architecture. Do not enable RCT_NEW_ARCH_ENABLED when integrating.