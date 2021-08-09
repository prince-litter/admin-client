import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import PropTypes from 'prop-types'

import {BASE_IMG_URL} from '../../utils/constants'
import {reqImgDelete} from '../../api/index'
export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs:PropTypes.array
  }
  state = {
    previewVisible: false, //控制大图预览的显示隐藏
    previewImage: '',  //大图的url
    fileList: [
        // {
        //     uid: -1, //每个file都有自己唯一的id
        //     name: 'xxx.png', //图片文件名
        //     status: 'done', //图片状态
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',//图片地址
        // }
    ],
  };

  constructor (props){
    super(props)
    let fileList = []
    const {imgs} = this.props
    if(imgs && imgs.length > 0){
        fileList = imgs.map((img, index) => (
            {
                uid: -index, //每个file都有自己唯一的id
                name: img, //图片文件名
                status: 'done', //图片状态 
                url: BASE_IMG_URL + img//图片地址
            }
        ))
    }
    //初始化显示
    this.state = {
        previewVisible: false, //控制大图预览的显示隐藏
        previewImage: '',  //大图的url
        fileList
    }
  }

  //获取上传图片名称的数组
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    //显示指定file对应的大图
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  /*
  file：当前操作的图片文件（上传/删除）
  fileList：所有已上传图片文件对象的数组
  */
  handleChange =async ({ file, fileList }) =>{ 
      console.log('fileList', fileList)
      //一旦上传成功，将当前上传的file的信息修正（name,url）
      if(file.status === 'done'){
        const result = file.response //{status:0.data:{name:'',url:''}}
        if(result.status === 0){
            message.success('图片上传成功')
            const {name, url} = result.data
            file = fileList[fileList.length-1]
            file.name = name
            file.url = url
        }else{
            message.error('图片上传失败')
        }
      }else if(file.status === 'removed'){//删除图片
        const result = await reqImgDelete(file.name)
        if(result.status === 0){
            message.success('图片删除成功')
        }else{
            message.error('图片删除失败')
        }
      }
      this.setState({ fileList })
    }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" //图片上传地址
          listType="picture-card" //图片页面显示样式
          accept="image/*" //只接收图片格式
          name="image" //请求参数名
          fileList={fileList}   //所有已上传图片文件对象的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}