const Koa = require("koa");
const Router = require("koa-router");
const cors = require('@koa/cors');

const koaBody = require('koa-body');

const rawBody = require('raw-body')
const Database = require("./dataBase");
const FileStorage = require("./fileStorage");
const fs = require("fs");
const dataConfig = fs.readFileSync("./config.json", 'utf8');
const metaData = JSON.parse(dataConfig);

const app = new Koa();
app.use(cors());
app.use(function* (next) {
  const type = this.req.headers["content-type"];
  if (type !== 'text/plain' && type !== 'application/json') {
    this.rawRequestBody = yield rawBody(this.req);
  }
  yield next
});

app.use(koaBody({
  includeUnparsed: true,
}));

const router = new Router()


const fileStorage = new FileStorage(metaData.fileStoragePath);
const database = new Database(metaData.databasePath);
require("./messageHandlers")(router, database,fileStorage);
require("./contentHandlers")(router, database,fileStorage);

app.use(router.routes()).use(router.allowedMethods())


const port = metaData.listenPort;
app.listen(port, () => {
  console.log('Server running on port 7070');
  //console.log(metaData.listenPort)
});
