let db = null;
let storage = null

function getRequestContentValue(ctx) {
  const contentType = ctx.request.header['content-type'];

    const body = contentType.startsWith('text/')
      ? ctx.request.body
      : ctx.rawRequestBody;

    const name = ctx.request.header['x-file-name']

    return {
      text: ctx.request.header['x-file-describe'],
      name: name,
      id: `${storage.putData(body, contentType, name)}`
    };

}

function createNewFileMsg(ctx) {
  if(!ctx.request.header['x-file-describe'] || !ctx.request.header['x-file-name']){
    ctx.response.status = 400;
    ctx.response.body = 'Message must have name and description in request.headers';
    return;
  }

  const content = getRequestContentValue(ctx)
  const message = {
    content: content,
    type: ctx.request.header['content-type'],
  };
  //console.log(message)
  const saveMsg = db.createSaveMsg(message)
  //console.log('saveMsg', saveMsg)
  if (!saveMsg) {
    ctx.response.status = 500;
    ctx.response.body = 'Message is not create';
    return;
  }

  ctx.response.body = JSON.stringify(saveMsg);
}

function createNewTextMsg(ctx) {
  //console.log(ctx.request)
  const content = {text: ctx.request.body, name: null, href: null}
  const message = {
    content: content,
    type: ctx.request.header['content-type'],
  };
  //console.log(message)
  const saveMsg = db.createSaveMsg(message)
  //console.log('saveMsg', saveMsg)
  if (!saveMsg) {
    ctx.response.status = 500;
    ctx.response.body = 'Message is not create';
    return;
  }

  ctx.response.body = JSON.stringify(saveMsg);
}

function getLastMsgList(ctx) {
  const start = ctx.query.start;
  const limit = ctx.query.limit;
  console.log('start',start,'limit',limit)
  const text = ctx.query.text;
  const type = ctx.query.type;
  const favorite = ctx.query.favorite;

  const list = db.getLastMsgList(start, limit, text, type, favorite)
  if (!list) {
    ctx.response.status = 500;
    ctx.response.body = 'Something is wrong';
    return;
  }
  ctx.response.body = JSON.stringify(list)
}

function toFavorite(ctx){
  const id = ctx.params.id;
  if(!db.toFavorite(id)){
    ctx.response.status = 500;
    ctx.response.body = 'Message with this id is not found';
    return
  }
  ctx.response.body = 'ok';
}


function getPinMsg(ctx) {
const pin = db.getPinMsg();
  if (!pin) {
    ctx.response.status = 201;
    ctx.response.body = 'Pin was not found';
    return;
  }
  ctx.response.body = JSON.stringify(pin)
}

function putPinMsg(ctx) {
  const id = ctx.request.body.id;
  if (!id) {
    ctx.response.status = 400;
    ctx.response.body = 'Id was not found';
    return;
  }
  console.log('id pin', id)
  const pin = db.putPinMsg(id);
  if (!pin) {
    ctx.response.status = 500;
    ctx.response.body = 'Message with such id was not found';
    return;
  }
  ctx.response.body = JSON.stringify(pin)
}

function deletePinMsg(ctx){
  const pin = db.deletePinMsg()
  if(pin){
    ctx.response.status = 500;
    ctx.response.body = 'Something is wrong';
  }
  ctx.response.body = 'ok'
}


module.exports = function (router, database, fileStorage) {
  db = database;
  storage = fileStorage;

  router.get('/api/messages', getLastMsgList);
  //router.get('/api/messages/pin', getPinMsg);
  //router.put('/api/messages/pin', putPinMsg);
  //router.get('/api/messages/by_type', getListMsgBySearchElem);
  //router.get('/api/messages/by_type/:type', getMsgList);
  router.post('/api/messages/text', createNewTextMsg);
  router.post('/api/messages/file', createNewFileMsg);
  //router.put('/api/messages/:id', updateMsg);
  router.patch('/api/messages/:id', toFavorite);
  //router.delete('/api/messages/pin', deletePinMsg);
}


/*function getListMsgBySearchElem(ctx){
  const searchElem = ctx.query.searchElem;
  console.log('searchElem msgHandler',searchElem)
  if(searchElem === '' || searchElem === ' '){
    ctx.response.status = 400;
    ctx.response.body = 'Uncorrected element for query';
    return
  }
  const list = db.getMsgListBySearchElem(searchElem);
  console.log('list query', list)
  if(list.length === 0){
    ctx.response.body = 'Nothing was found for your query';
    return
  }
  //ctx.response.body = JSON.stringify(list)
}*/
/*function getOneMsg(ctx) {
  const id = ctx.params.id;
  const msg = db.getOneMsg(id);
  if (!msg) {
    ctx.response.status = 404;
    ctx.response.body = 'Message is not found';
    return;
  }
  ctx.response.body = JSON.stringify(msg);
}*/

/*function getMsgList(ctx) {
  const searchData = ctx.request.body;
  const list = db.getMsgList(searchData);
  if (!list) {
    ctx.response.status = 404;
    ctx.response.body = 'Messages is not found';
    return;
  }
  ctx.response.body = JSON.stringify(list);
}*/

/*function updateMsg(ctx) {
  const data = ctx.request.body;
  const msg = db.updateMsg(data);
  if (!msg) {
    ctx.response.status = 404;
    ctx.response.body = 'Message is not update';
    return;
  }

  ctx.response.body = JSON.stringify(msg);
}*/

/*function deleteMsg(ctx) {
  const id = ctx.params.id;
  const msg = db.deleteMsg(id);
  if (!msg) {
    ctx.response.status = 404;
    ctx.response.body = 'Message is not delete';
    return;
  }
  ctx.response.body = msg;
}*/

