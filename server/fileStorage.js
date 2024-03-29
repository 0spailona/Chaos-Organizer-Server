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
    return {contentPath: `${this.path}/${name}`, typePath: `${this.path}/${name}.meta`};
  }

  putData(content, type,name) {

    const id = uuid.v4();
    const data = JSON.stringify({type,name})
    fs.writeFileSync(`${this.path}/${id}`, content);
    fs.writeFileSync(`${this.path}/${id}.meta`, data, "utf-8")
    return id
  }

  getData(id) {
    console.log('id', id)
    const {contentPath, typePath} = this.getPath(id);

    if (!fs.existsSync(contentPath) || !fs.existsSync(typePath)) return null

    const content = fs.readFileSync(`${this.path}/${id}`);
    const meta = JSON.parse(fs.readFileSync(`${this.path}/${id}.meta`, "utf-8"));

    console.log('meta', meta)

    return {meta, content}
  }

  deleteData(name) {
    //////// TODO
  }
}

module.exports = FileStorage
