import React,{Component} from 'react'
import {Form, Input, Select} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option
class userForm extends Component{
    static propTypes = {
        setForm:PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired
    }
    UNSAFE_componentWillMount() {
        const {form} = this.props
        this.props.setForm(form)
    }
    render() {
        const {roles, user} = this.props
        const {getFieldDecorator} = this.props.form
        const formLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 16}
        }
        return(
            <Form {...formLayout}>
                <Item label='用户名'>
                    {getFieldDecorator('username',{
                        initialValue: user.username
                    })(
                        <Input placeholder='请输入用户名'></Input>
                    )}
                </Item>
                {
                    user._id ? null : (
                        <Item label='密码'>
                            {getFieldDecorator('password',{
                                initialValue:''
                                })(<Input type='password' placeholder='请输入密码'></Input>)
                            }
                        </Item>
                    )
                }
                <Item label='手机号'>
                    {getFieldDecorator('phone',{
                        initialValue: user.phone
                    })(
                        <Input placeholder='请输入手机号'></Input>
                    )}
                </Item>
                <Item label='邮箱'>
                    {getFieldDecorator('email',{
                        initialValue: user.email
                    })(
                        <Input placeholder='请输入邮箱'></Input>
                    )}
                </Item>
                <Item label='角色'>
                    {getFieldDecorator('role_id',{
                        initialValue: user.role_id
                    })(
                        <Select>
                            {
                                roles.map((role) =>  <Option value={role._id} key={role._id}>{role.name}</Option>)
                            }
                        </Select>
                    )}
                </Item>
            </Form>
        )
    }
}
export default Form.create()(userForm)