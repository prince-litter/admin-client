import React,{Component} from 'react'
import { Form, Icon, Input, Button, message, } from 'antd';

import './css/login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api/index'
import mermoryUtils from '../../utils/mermoryUtils';
import storageUtils from '../../utils/storageUtils';
import { Redirect } from 'react-router-dom';
class Login extends Component{
    handleSubmit = (event) =>{
        event.preventDefault()
        const {validateFields} = this.props.form
        validateFields(async (err, values) =>{   
            if (!err) {
                // 校验成功
                const {username, password} = values           
                const result = await reqLogin(username,password)   
                if(result.status === 0){
                    message.success('登录成功')

                    //保存user
                    const user = result.data
                    mermoryUtils.user = user
                    storageUtils.saveUser(user)
                    this.props.history.push('/')        
                }else{
                    message.error(result.msg)
                }                 
            } else {
                // 校验失败
                console.log('校验失败')
            }
        })
        // console.log(getFieldsValue())
    }
    //自定义密码校验规制
    validator = (rule, value, callback)=>{
        if(!value){
            callback('必须输入密码')
        }else if(value.length < 4){
            callback('必须大于四位')
        }else if(value.length > 12){
            callback('不能超过12位')
        }else if(/^[a-zA-Z0-9_+]$/.test(value)){
            callback('必须是英文、数组或下划线组成')
        }else{
            callback()
        }
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const user = mermoryUtils.user
        if(user._id){
            return <Redirect to='/admin'/>
        }
        return(
            <div className='login'> 
                <header className='login-header'>
                    <img src={logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {
                                getFieldDecorator('username',{
                                    rules:[
                                        {required: true, whitespace: true, message: '必须输入用户名'},
                                        {min: 4, message: '用户名必须大于 4 位'},
                                        {max: 12, message: '用户名必须小于 12 位'},
                                        {pattern: /^[a-zA-Z0-9_]+$/,message:'用户名必须是英文、数组或下划线组成' }
                                    ]
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                    />
                                )
                            }
                           
                        </Form.Item>
                        <Form.Item>  
                            {
                                getFieldDecorator('password',{
                                    rules:[
                                       { validator: this.validator }
                                    ]
                                })(
                                    <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                    />
                                )
                            }     
                        </Form.Item>
                        <Form.Item> 
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>       
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default Form.create()(Login);