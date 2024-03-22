const fs = require('fs');
const uuid = require('uuid')
const {by, descendingBy} = require("./utils");

class DataBase {
  constructor(path) {
    this.path = path;
    this.loadData();
  }

  loadData() {
    try {
      const saveData = fs.readFileSync(this.path, 'utf8');
      this.data = JSON.parse(saveData);
    } catch (e) {
      this.data = {pin: null, messages: {}};
    }
  }


  saveData() {
    const saveData = JSON.stringify(this.data);
    fs.writeFileSync(this.path, saveData, 'utf8');
  }

  createSaveMsg(msg) {
    msg.id = uuid.v4();
    msg.created = new Date().toISOString();
    msg.isFavorite = false;
    this.data.messages[msg.id] = msg;
    this.saveData()
    return msg;
  }

  putPinMsg(id) {
    const pin = Object.values(this.data.messages).find(x => x.id === id);
    if (!pin) return null;
    console.log('pin', pin)
    this.data.pin = pin;
    this.saveData()
    return pin;
  }

  getPinMsg() {
    return this.data.pin
  }

  deletePinMsg(){
    this.data.pin = null;
    this.saveData()
    return this.data.pin;
  }

  getLastMsgList(start, limit, text, type, favorite) {

    let arr = Object.values(this.data.messages);

    if (text) arr = arr.filter(x => x.content.text?.includes(text));

    if (type) arr = arr.filter(x => x.type?.includes(type));

    if (favorite) {
      arr = arr.filter(x => x.isFavorite);
    }

    const saveDataSorted = arr.sort(descendingBy(x => x.created))
    return saveDataSorted.splice(start, limit)
  }


  getOneMsg(id) {
    return this.data.messages[id]
  }

  getMsgList(type, isFavorite) {
    console.log(type);
    console.log(isFavorite)
    if (type) {
      return Object.values(this.data.messages).map(x => x.type === type)
    }
    if (isFavorite) {
      return Object.values(this.data.messages).map(x => x.isFavorite === true)
    }
  }


  updateMsg(data) {
    this.data.messages[data.id] = data;
    this.saveData();
    return data;
  }

  deleteMsg(id) {
    if (!this.data.messages[id]) return false
    delete this.data.messages[id];
    this.saveData();
    return true
  }


}

module.exports = DataBase;
