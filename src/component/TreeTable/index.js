import React, { Component } from 'react';
import { Table, message, Radio, Tag, Checkbox } from 'antd';
import _ from 'lodash'
import treeData from './tree.json'
const RadioGroup = Radio.Group;

message.config({
  top: 100,
  duration: 2,
});
const s = {
  valueListWrap: {
    overflow: 'hidden',
    maxWidth: 170,
    height: 25,
    display: 'inline-block',
  },
  wrapHeight: {
    height: 34,
    display: 'inline-block',
    position: 'relative',
    top: 8,
  },
  selectRow: {
    position: 'relative',
    top: -2,
    marginLeft: 4,
  },
};

class AttributeTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      dataSource: []
    }
    this.templateId = null
    this.treeModal = []
    this.templateData = []
    this.oprateData = []
    this.spreadTreeList = []
    this.columns = [{
      title: '属性名称 (选中代表已添加)',
      key: 'propertyName',
      dataIndex: 'propertyName',
      width: 230,
      render: (text, rowData) => (
        <span>
          <Checkbox
            style={s.selectRow}
            checked={rowData.selected}
            disabled={!rowData.isEdit}
            onChange={(e) => this.onSelectRow(e, rowData)}
          />
          {text}
        </span>
      )
    }, {
      title: '属性ID',
      key: 'propertyId',
      dataIndex: 'propertyId',
      width: 70,
      render: (text, rowData) => (
        <span style={s.wrapHeight}>{text}</span>
      )
    }, {
      title: '属性分类',
      key: 'propertyTypeName',
      dataIndex: 'propertyTypeName',
      width: 70

    }, {
      title: '属性值',
      key: 'propValues',
      dataIndex: 'propValues',
      width: 180,
      render: (text, rowData, index) => {
        if (text.length === 0) {
          return <div>-</div>
        }
        return (
          <div>
            <div >
              {this.renderValueList(text)}
            </div>
          </div>
        )
      }
    }, {
      title: '必选属性',
      key: 'required',
      dataIndex: 'required',
      width: 70,
      render: (text, rowData, index) => (
        <Checkbox checked={text} disabled={!rowData.isEdit} onChange={(e) => { this.handChange(e, rowData, 'required') }} />
      )
    }, {
      title: '录入类型', // 1-枚举属性 2-非枚举属性 3-区间属性 4-标签属性,   枚举才有多选
      key: 'inputType',
      dataIndex: 'inputType',
      width: 200,
      render: (text, rowData, index) => this.renderEntryType(rowData)
    }, {
      title: '操作',
      key: 'hasOperation',
      dataIndex: 'hasOperation',
      width: 100,
      render: (text, rowData, index) => {
        if (!rowData.isRoot) {
          return false
        } else {
          if (rowData.isEdit) { //
            return (
              <div style={s.wrapHeight}>
                <a href='javascript:;' onClick={this.updateSingleData.bind(this, rowData)}>确认</a>
                <span style={{ margin: '0px 5px' }} />
                <a href='javascript:;' onClick={() => this.cancelHandler(rowData)}>取消</a>
              </div>
            )
          } else {
            return (
              <div style={s.wrapHeight}>
                <a href='javascript:;' onClick={() => this.changeEdit(rowData)}>编辑</a>
              </div>
            )
          }
        }
      }
    }]
  }
  handChange = (e, rowData, type) => {
    const val = e.target.checked
    switch (type) {
      case 'required':
        rowData.required = val
        break
      case 'inputType':
        rowData.inputType = e.target.value
        break
      case 'inputType_checkbox' :
        rowData.inputType = val ? 1 : 0
        break
      default:
        break
    }
    this.setState({})
  }
  // 选中当前行
  onSelectRow = (e, rowData) => {
    const {parentIds} = rowData
    rowData.selected = e.target.checked
    // 选中父节点同时选中所有子节点
    const findNode = (arr) => {
      arr.forEach(i => {
        i.selected = e.target.checked
        if (i.children) {
          findNode(i.children)
        }
      })
    }
    rowData.selected = e.target.checked
    if (rowData.children) {
      findNode(rowData.children)
    }
    // 判断一下如果是根节点不执行
    if (e.target.checked) {
    // 选中子节点同时选中所有父节点
      if (parentIds) {
        this.selectParentNodes(parentIds, e)
      }
    } else {
      // 取消选中的时候判断父节点是否应该取消
      this.canceParentNodes()
    }
    this.oprateData = _.cloneDeep(this.dataSource)
    this.setState(this.state)
  }
  // 选中当前行的父亲节点
  selectParentNodes (parentIds, e) {
    const findParentNode = (arr) => {
      arr.forEach(dataItem => {
        parentIds.forEach(parentItem => {
          if (dataItem.propertyId === parentItem) {
            dataItem.selected = e.target.checked
            if (dataItem.children) {
              findParentNode(dataItem.children)
            }
          }
        })
      })
    }
    this.dataSource.forEach(dataItem => {
      parentIds.forEach(parentItem => {
        if (dataItem.propertyId === parentItem) {
          dataItem.selected = e.target.checked
          if (dataItem.children) {
            findParentNode(dataItem.children)
          }
        }
      })
    })
  }
  // 子节点都取消的时候父亲节点全部取消
  canceParentNodes () {
    const cancel = (arr, i) => {
      let check = true
      arr.forEach(child => {
        if (child.children) {
          cancel(child.children, child)
        }
        if (child.selected) {
          check = false
        }
      })
      if (check) {
        i.selected = false
      }
    }
    this.dataSource.forEach(i => {
      if (i.isEdit) {
        if (i.children) {
          cancel(i.children, i)
        }
      }
    })
  }
  async componentDidMount() {
    this.setState({loading: false})
      await this.getTreeData()
      this.treeModal = this.dealData(this.treeModal)
      this.dataSource = this.treeModal
      // this.defaultSelected()
      this.oprateData = _.cloneDeep(this.dataSource)
      this.setState({})
  }
  //  获取树状结构
  async getTreeData () {
    this.treeModal = treeData.response.propSets
  }
  //  构造树start
  builTree = (root, nodes) => {
    nodes.forEach(node => {
      node.isEdit = false
      node.propValues = Array.from(new Set(node.propValues))
      if (node.parentPropertyId === root.propertyId) {
        root.children = root.children || []
        root.children.push(node)
        this.builTree(node, nodes)
      }
    })
  }
  dealData (arr) {
    let trees = []
    arr.forEach((node, index) => {
      node.parentTreeIds = []
      if (Number(node.parentPropertyId) === -1) {
        node.isRoot = true // 根节点有编辑和删除
        node.isEdit = false
        trees.push(node)
      }
    })
    trees.forEach((tree, index) => this.builTree(tree, arr))
    this.addParentIds(trees)
    return trees
  }
  addParentIds (tree) {
    const ids = []
    const each = (tree, arr) => {
      tree.forEach(i => {
        i.parentIds = [...arr, i.parentPropertyId]
        if (i.children) {
          each(i.children, i.parentIds)
        }
      })
    }
    tree.forEach((i, index) => {
      i.index = index + 1
      i.parentIds = []
      i.treeRoot = true
      if (i.children) {
        each(i.children, i.parentIds, i.selected)
      }
    })
  }
  // 编辑激活状态
  changeEdit = (rowData) => {
    const findNode = (arr) => {
      arr.forEach(i => {
        i.isEdit = rowData.isEdit
        if (i.children) {
          findNode(i.children)
        }
      })
    }
    rowData.isEdit = !rowData.isEdit
    if (rowData.children) {
      findNode(rowData.children)
    }
    // this.oprateData = _.cloneDeep(this.dataSource)
    this.setState({})
  }
  // 取消状态
  cancelHandler = (rowData) => {
    this.dataSource = _.cloneDeep(this.oprateData)
    const findNode = (arr) => {
      arr.forEach(i => {
        i.isEdit = false
        if (i.children) {
          findNode(i.children)
        }
      })
    }
    this.dataSource.forEach(i => {
      if (i.isEdit) {
        i.isEdit = false
        if (i.children) {
          findNode(i.children)
        }
      }
    })
    this.setState({})
  }
  // 更新当前行
  updateSingleData (rowData) {
    const arr = []
    this.spreadTree(rowData, arr)
    const propertyType = rowData.index
    this.updateRowData(arr, propertyType, rowData)
  }
  async updateRowData (arr, propertyType, rowData) {
      this.oprateData = _.cloneDeep(this.dataSource)
      this.changeEdit(rowData)
      message.success('保存成功')
      this.setState({})
  }
  // 平铺数据传给服务端
  spreadTree (rowData, arr) {
    const spreadData = (children, arr) => {
      children.forEach(i => {
        if (i.selected) {
          arr.push({
            'inputType': i.inputType,
            'parentPropertyId': i.parentPropertyId,
            'propertyId': i.propertyId,
            'propertyType': i.propertyType,
            'required': i.required,
            'propertyName': i.propertyName
          })
        }
        if (i.children && i.selected) {
          spreadData(i.children, arr)
        }
      })
    }
    if (rowData.selected) {
      arr.push({
        'inputType': rowData.inputType,
        'parentPropertyId': rowData.parentPropertyId,
        'propertyId': rowData.propertyId,
        'propertyType': rowData.propertyType,
        'required': rowData.required,
        'propertyName': rowData.propertyName
      })
    }
    if (rowData.children && rowData.selected) {
      spreadData(rowData.children, arr)
    }
  }
  renderValueList (valueList: Array) {
    return (
      valueList.map((item, index) => (
        <Tag key={index}>{item.valueData}</Tag>
      ))
    )
  }
  renderEntryType (rowData) { // 1-枚举属性 2-非枚举属性 3-区间属性 4-标签属性
    const {inputType} = rowData
    return (
      <div>{!rowData.children && rowData.parentIds.length
        ? <div>
          <RadioGroup onChange={(e) => { this.handChange(e, rowData, 'inputType') }} value={inputType} disabled={!rowData.isEdit}>
            <Radio key='1' value={1}>枚举单选</Radio>
            <Radio key='2' value={2}>枚举多选</Radio>
            <Radio key='3' value={3}>非枚举属性</Radio>
          </RadioGroup>
          {/* {Number(rowData.inputType) === 2 && this.renderMultiSelected(inputType)} */}
        </div>
      : <Checkbox checked={inputType !== 0} onChange={(e) => { this.handChange(e, rowData, 'inputType_checkbox') }} disabled={!rowData.isEdit}>枚举单选</Checkbox>
     }</div>
    )
  }
  renderMultiSelected (inputType) {
    return (
      <div>
        <Checkbox checked={true} disabled={true}>是否是多选枚举</Checkbox>
      </div>
    )
  }
  render () {
    console.log(1)
    return (
      <Table
        size='small'
        style={{ marginTop: 20, width: window.innerWidth }}
        indentSize={20}
        useFixedHeader
        loading={this.state.loading}
        dataSource={this.dataSource}
        columns={this.columns}
        pagination={false}
      />
    )
  }
}
export default AttributeTable
