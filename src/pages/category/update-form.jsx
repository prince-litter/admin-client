import React,{Component} from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item

class UpdateForm extends Component{
    static propTypes = {
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }
    UNSAFE_componentWillMount() {
        const {form} = this.props
        this.props.setForm(form)
    }

    render() {
        const {categoryName} = this.props
        const {getFieldDecorator} = this.props.form
        return(
            <Form>
                <Item label='分类名称'>
                    {getFieldDecorator('categoryName',{
                        initialValue: categoryName,
                        rules:[
                            {required: true, message: '分类名称必须输入'}
                        ]
                    })(
                        <Input placeholder='请输入分类'></Input>
                    )}
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UpdateForm)