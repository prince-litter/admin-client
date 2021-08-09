/*
入口js
*/
import React from 'react'
import ReactDom from 'react-dom'


import App from './App'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/mermoryUtils'
//读取local中保存的user，保存在内存中
const user = storageUtils.getUser()
memoryUtils.user = user

ReactDom.render(<App/>, document.getElementById('root'))  