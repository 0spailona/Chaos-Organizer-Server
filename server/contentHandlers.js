
function getContent(ctx) {
  //console.log('params',ctx.params.id)
  const {meta, content} = ctx.storage.getData(ctx.params.id) ?? {};
  if (!content) {
    ctx.response.status = 404;
    ctx.response.body = 'Content is not found';
    return;
  }
  ctx.set('content-type', meta.type);
  ctx.set('content-disposition', `attachment; filename=${meta.name}`, )
  ctx.response.body = content;
}

module.exports = function (router) {

  router.get('/api/content/:id', getContent);
  //router.get('/api/messages/by_type/:type', getMsgList);
  //router.post('/api/messages', createNewMsg);
  //router.put('/api/messages/:id', updateMsg);
  //router.delete('/api/tickets/:id', deleteMsg);
}
