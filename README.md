# react-native-urwaypaymentplugin

Urway React Native Plugin

## Installation

```sh
npm install react-native-urwaypaymentplugin
```

## Usage


```js
import { useUrway } from 'react-native-urwaypaymentplugin';

// ...Apple Pay Integration

const pay = useUrway(JSON.stringify(data));


// ...Purchase,Pre Auth,Tokenization Transaction Integration

(<PluginApp data={JSON.stringify(data)}  onCloseModal={handleCloseModal} />
  ) :( <Text style={styles.txtAction}></Text> ) 
```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
