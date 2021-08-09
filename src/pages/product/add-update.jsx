import React,{PureComponent} from 'react'
import {Card, Icon, Button, Form, Input, Cascader, message} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api/index'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
const {Item} = Form
const {TextArea} = Input
class ProductAddUpdate extends PureComponent{
    state = {
        options:[]
    }
    constructor(props){
        super(props)
        this.pw = React.createRef()//创建ref容器
        this.editor = React.createRef()
    }
    /*
        用于加载下一级列表的回调函数
    */
    loadData = async selectedOptions => {
        //得到选择的option对象
        const targetOption = selectedOptions[0];
        //显示loading
        targetOption.loading = true;
        //根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategroys(targetOption.value)
        targetOption.loading = false;
        //二级分类有数据
        if(subCategorys && subCategorys.length > 0){
            //生成一个二级分类列表的options
            const childOptions = subCategorys.map(c =>({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            targetOption.children = childOptions
        }else{
            targetOption.isLeaf = true
        }
        //更新options的状态
        this.setState({
            options: [...this.state.options]
        })
       
      };

    initOptions = async (categorys) => {
        const options = categorys.map(c =>({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
        //如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId !== '0'){
            const subCategorys =await this.getCategroys(pCategoryId)
            //生成一个二级分类列表的options
            const childOptions = subCategorys.map(c =>({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            //找到当前商品对应的一级option对象
            const targetOption = options.find((option) => option.value === pCategoryId)
            //关联对应的一级option上
            targetOption.children = childOptions
        }
        //更新option
        this.setState({
            options
        })
    }
      //获取一级二级分类列表
      //async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
    getCategroys = async(parentId) =>{
        const result = await reqCategorys(parentId)
        if(result.status === 0) {
            const categorys = result.data
            if(parentId === '0'){//如果一级分类，才初始化option
                this.initOptions(categorys)
            }else{//二级列表
                return categorys //返回二级列表。当前asyn函数返回的promise就会成功且value为categorys
            }
        }
    }
    //表单提交
    submit = () => {
        const {validateFields} = this.props.form
        validateFields(async (err,values) => {
            if(!err) {
                //数据准备
                const {name, desc, price, categoryIds} = values
                let pCategoryId,categoryId
                if(categoryIds.length === 1){
                    pCategoryId = categoryIds[0]
                }else{
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()//通过ref容器读取标签元素：this.pw.current
                const detail = this.editor.current.getDetail()
                const product = {name, desc, price, imgs, detail, pCategoryId , categoryId}
                //判断是更新还是添加
                if(this.isUpdate){
                    product._id = this.product._id
                }
                //发送请求
                const result = await reqAddOrUpdateProduct(product)
                if(result.status === 0){
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
                    this.props.history.goBack()
                }else{
                    message.error(`${this.isUpdate? '更新' : '添加'}商品失败!`)
                }
            }
        })
    }
   
    //表单价格的自定义校验
    validatorPrice = (rule, value, callback) => {
        if(value*1 > 0){
            callback()
        }else{
            callback('价格必须大于零')
        }
    }

    UNSAFE_componentWillMount() {
        //取出携带的state
        const product = this.props.location.state//如果是添加没值，否则有值
        //保存是否是更新的标识
        this.isUpdate = !!product
        this.product = product || {} //有赋值没得空对象防止报错
    }

    componentDidMount() {
        this.getCategroys('0')
    }
    render() {
        const {isUpdate, product} = this
        const {pCategoryId,categoryId, imgs, detail} = product
        //用来接收级联分类ID的数组
        const categoryIds = []
        if(isUpdate){//如果是修改商品的值
            if(pCategoryId === ''){
                //商品是一级分类商品
                categoryIds.push(pCategoryId)
            }else{
                //商品是二级分类商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{fontSize:20}}/>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        const formItemLayout = {
            labelCol: {span:2},
            wrapperCol: {span:8},
          }
        const {getFieldDecorator} = this.props.form
        return(
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {
                            getFieldDecorator('name',{
                                initialValue: product.name,
                                rules:[{required: true, message:'必须输入商品名称'}]
                            })(<Input/>)
                        }
                        
                    </Item>
                    <Item label='商品描述'>
                        {
                            getFieldDecorator('desc',{
                                initialValue:product.desc,
                                rules:[{required: true, message:'必须输入商品描述'}]
                            })(<TextArea  autosize={{ minRows: 2, maxRows: 6 }}/>)
                        }
                    </Item>
                    <Item label='商品价格'>
                        {
                            getFieldDecorator('price',{
                                initialValue:product.price,
                                rules:[
                                    {required: true, message:'必须输入商品价格'},
                                    {validator:this.validatorPrice}
                                ],
                               
                            })(<Input type='number'addonAfter='元'/>)
                        }
                    </Item>
                    <Item label='商品分类'>
                        {
                            getFieldDecorator('categoryIds',{
                                initialValue:categoryIds,
                                rules:[
                                    {required: true, message:'必须指定商品分类'},
                                ], 
                            })(<Cascader
                                placeholder='请指定商品分类'
                                options={this.state.options}
                                loadData={this.loadData}
                            />)
                        }
                        
                    </Item>
                    <Item label='商品图片'>
                        {/* 自动将标签对象添加为pw对象的current属性 */}
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label='商品详情'  labelCol={{span:2}} wrapperCol={{span:20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)

/*
    1.子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
    2.父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
*/