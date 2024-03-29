let db = null;
let storage = null;

function getContent(ctx) {
  console.log('params',ctx.params.id)
  const {meta, content} = storage.getData(ctx.params.id);
  if (!content) {
    ctx.response.status = 404;
    ctx.response.body = 'Content is not found';
    return;
  }
  ctx.set('content-type', meta.type);
  ctx.set('content-disposition', `attachment; filename=${meta.name}`, )
  ctx.response.body = content;
}

module.exports = function (router, database, fileStorage) {
  db = database;
  storage = fileStorage;

  router.get('/api/content/:id', getContent);
  //router.get('/api/messages/by_type/:type', getMsgList);
  //router.post('/api/messages', createNewMsg);
  //router.put('/api/messages/:id', updateMsg);
  //router.delete('/api/tickets/:id', deleteMsg);
}
