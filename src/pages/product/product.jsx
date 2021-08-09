import React,{Component} from 'react'
import {Switch, Redirect, Route} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import './product.less'
export default class Product extends Component{
    render() {
        return(
            <Switch>
                <Route path='/product' component={ProductHome} exact/>  {/* exact :路径完全匹配*/}
                <Route path='/product/detail' component={ProductDetail}/> 
                <Route path='/product/addUpdate' component={ProductAddUpdate}/> 
                <Redirect to='/product' exact/>
            </Switch>
        )
    }
}