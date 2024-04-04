function getRequestContentValue(ctx) {
  const contentType = ctx.request.header['content-type'];

  const body = contentType.startsWith('text/')
    ? ctx.request.body
    : ctx.rawRequestBody;

  const name = decodeURI(ctx.request.header['x-file-name'])

  return {
    text: decodeURI(ctx.request.header['x-file-describe']),
    name: name,
    id: `${ctx.storage.putData(body, contentType, name)}`
  };

}

function createNewFileMsg(ctx) {
  if (!ctx.request.header['x-file-describe'] || !ctx.request.header['x-file-name']) {
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
  const saveMsg = ctx.db.createSaveMsg(message)
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
  const content = {text: ctx.request.body, name: null, id: null}
  const message = {
    content: content,
    type: ctx.request.header['content-type'],
  };
  //console.log(message)
  const saveMsg = ctx.db.createSaveMsg(message)
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
  // console.log('start',start,'limit',limit)
  const text = ctx.query.text;
  const type = ctx.query.type;
  const favorite = ctx.query.favorite;

  //console.log('text',text)
  const list = ctx.db.getLastMsgList(start, limit, text, type, favorite)
  if (!list) {
    ctx.response.status = 500;
    ctx.response.body = 'Something is wrong';
    return;
  }
  ctx.response.body = JSON.stringify(list)
}

function toFavorite(ctx) {
  const id = ctx.params.id;
  if (!ctx.db.toFavorite(id)) {
    ctx.response.status = 500;
    ctx.response.body = 'Message with this id is not found';
    return
  }
  ctx.response.body = 'ok';
}


function getPinMsg(ctx) {
  const pin = ctx.db.getPinMsg();
  if (!pin || !pin.content) {
    ctx.response.status = 404;
    ctx.response.body = 'Pin was not found';
    return;
  }
  ctx.response.body = JSON.stringify(pin)
}

function putPinMsg(ctx) {
  const id = ctx.request.body
  if (!id) {
    ctx.response.status = 400;
    ctx.response.body = 'Id was not found';
    return;
  }
  //console.log('id pin', id)
  const pin = ctx.db.putPinMsg(id);
  if (!pin) {
    ctx.response.status = 500;
    ctx.response.body = 'Message with such id was not found';
    return;
  }
  ctx.response.body = JSON.stringify(pin)
}

function deletePinMsg(ctx) {
  const pinDelete = ctx.db.deletePinMsg()
  if (pinDelete) {
    ctx.response.status = 500;
    ctx.response.body = 'Something is wrong';
  }
  ctx.response.body = 'ok'
}

function deleteMessage(ctx) {
  const id = ctx.params.id;
  const result = ctx.db.deleteMsg(id)
  //console.log('result', result)
  if (!result.isMessageDeleted && result.text) {
    ctx.response.status = 500;
    ctx.response.body = result.text;
    return
  }

  if (result.href) {
    const isContentDeleted = ctx.storage.deleteData(result.href)
    //console.log('isContentDeleted', isContentDeleted)
    if (!isContentDeleted.result) {
      ctx.response.status = 500;
      ctx.response.body = isContentDeleted.text;
    }
  }

  ctx.response.body = 'ok';
}

module.exports = function (router) {
  router.get('/api/messages', getLastMsgList);
  router.get('/api/messages/pin', getPinMsg);
  router.put('/api/messages/pin', putPinMsg);
  //router.get('/api/messages/by_type', getListMsgBySearchElem);
  //router.get('/api/messages/by_type/:type', getMsgList);
  router.post('/api/messages/text', createNewTextMsg);
  router.post('/api/messages/file', createNewFileMsg);
  //router.put('/api/messages/:id', updateMsg);
  router.patch('/api/messages/:id', toFavorite);
  router.delete('/api/messages/pin', deletePinMsg);
  router.delete('/api/messages/:id', deleteMessage)
}

/*function getOneMsg(ctx) {
  const id = ctx.params.id;
  const msg = ctx.db.getOneMsg(id);
  if (!msg) {
    ctx.response.status = 404;
    ctx.response.body = 'Message is not found';
    return;
  }
  ctx.response.body = JSON.stringify(msg);
}*/


/*function updateMsg(ctx) {
  const data = ctx.request.body;
  const msg = ctx.db.updateMsg(data);
  if (!msg) {
    ctx.response.status = 404;
    ctx.response.body = 'Message is not update';
    return;
  }

  ctx.response.body = JSON.stringify(msg);
}*/


