
import { AppRegistry } from 'react-native';
import './src/Common/SetTheme'
import './src/Common/Global'


import App from './App';

console.ignoredYellowBox = ['Warning: BackAndroid is deprecated. Please use BackHandler instead.','source.uri should not be an empty string','Invalid props.style key'];
 
console.disableYellowBox = true // 关闭全部黄色警告
 


AppRegistry.registerComponent('myAPP', () => App);