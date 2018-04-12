import React, { Component } from 'react';
const arr  = [
    {
    parentId: null,
    title: -1,
    id: -1
    },
     {
        parentId: -1,
        title: '0-0',
        id: 0
    },
    {
        parentId: -1,
        title:'0-1',
        id: 1
    },
    {
        parentId: 0,
        title: '1-0',
        id: 10
    },
    {
        parentId: 0,
        title: '2-1',
        id: 20
    },
    {
        parentId: 1,
        title: '1-1',
        id: 11
    },
    {
        parentId: 1,
        title: '2-1',
        id: 21
    },
]
const builTree = (root, nodes) => {
    nodes.forEach(node => {
        if(node.parentId === root.id){
            root.children = root.children || []
            root.children.push(node)
            builTree(node, nodes)
        }
    }
    )
}
let trees = []
let result = []
arr.forEach( node => {
    if(node.parentId === null){
        trees.push(node)
    }
})
trees.forEach(tree => builTree(tree,arr))
export default class App extends Component {
  constructor () {
    super ()
    this.state = {
    }
    this.count = 0
  }
  handChange(index, id, e) {
    arr.forEach((i, index,n) => {
      if(id === i.id){
        n[index].title = e.target.value
      }
    })
    console.log(arr, '111')
  }
	renderTree (data) {
    let nodes 
    nodes = data.map((i, index) => {
      let node = (<div key={this.count ++} style={{marginRight: 10}}>
        <input  defaultValue={i.title} onChange={(e) =>this.handChange(index, i.id, e)}/>
      </div>)
      if (i.children && i.children.length) {
          node = <div key={this.count ++}  style={{marginRight: 10}} >
            <input defaultValue={i.title} onChange={(e) =>this.handChange(index, i.id, e)}/>
              {this.renderTree(i.children)}
          </div>
      }
      return node
    })
    return <div>{nodes}</div>
  }	
  render() {
  this.count = 0
      return(<div>{this.renderTree(trees)}</div>)
  }
}
