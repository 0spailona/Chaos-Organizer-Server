const fs = require('fs');
const uuid = require('uuid')

class FileStorage {
  constructor(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {recursive: true});
    }
    this.path = path;
  }

  getPath(name) {
    return {contentPath: `${this.path}/${name}`, typePath: `${this.path}/${name}.type`};
  }

  putData(content, type) {

    const name = uuid.v4();
    fs.writeFileSync(`${this.path}/${name}`, content);
    fs.writeFileSync(`${this.path}/${name}.type`, type, "utf-8")
    return name
  }

  getData(name) {
    console.log('name', name)
    const {contentPath, typePath} = this.getPath(name);

    if (!fs.existsSync(contentPath) || !fs.existsSync(typePath)) return null

    const content = fs.readFileSync(`${this.path}/${name}`);
    const type = fs.readFileSync(`${this.path}/${name}.type`, "utf-8");
    console.log('type', type)

    return {type, content}
  }

  deleteData(name) {
    //////// TODO
  }
}

module.exports = FileStorage
