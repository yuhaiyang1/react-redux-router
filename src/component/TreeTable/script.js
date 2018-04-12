const fs = require('fs')
fs.readFile('tree.json','utf8',(err, data) => {
  if (err) console.log(err);
  var treeData=JSON.parse(data);
  const randomHz = () => {
    eval( "var word=" +  '"\\u' + (Math.round(Math.random() * 20901) + 19968).toString(16)+'"');
    return word;
  }
  // 随机生成三个汉字
  const randomCharacter = () => {
    const arr = []
    for(i=0;i<3;i++){
      arr.push(randomHz())
    }
    return  arr.join('')
  }
  
  treeData.response.propSets.forEach(i => {
    i.propValues = [{valueId: 1, valueData: '测试'}]
    i.propertyName = randomCharacter
  })
  var t = JSON.stringify(treeData);
  fs.writeFileSync('tree.json',t)
});