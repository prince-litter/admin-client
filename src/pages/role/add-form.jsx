import React,{Component} from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

class AddForm extends Component{
    static propTypes = {
        setForm:PropTypes.func.isRequired
    }
    UNSAFE_componentWillMount() {
        const {form} = this.props
        this.props.setForm(form)
    }
    render() {
        const {getFieldDecorator} = this.props.form
        return(
            <Form>
                <Item label='角色名称' labelCol={{span: 6}} wrapperCol={{span: 16}}>
                    {getFieldDecorator('roleName',{
                        rules:[
                            {required: true, message: '角色名称必须输入'}
                        ]
                    })(
                        <Input placeholder='请输入角色名称'></Input>
                    )}
                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)