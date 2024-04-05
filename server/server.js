const Koa = require("koa");
const Router = require("koa-router");
const session = require("koa-session");
const cors = require("@koa/cors");
const uuid = require("uuid");

const koaBody = require("koa-body");

const rawBody = require("raw-body");
const Database = require("./dataBase");
const FileStorage = require("./fileStorage");
const fs = require("fs");
const dataConfig = fs.readFileSync("./config.json", "utf8");
const config = JSON.parse(dataConfig);

const app = new Koa();

app.use(cors({
  credentials: true
}));

app.use(function* (next) {
  console.log(this.request.url);

  // TODO: add user session later
  this.db = new Database(`${config.databasePath}/db.json`);
  this.storage = new FileStorage(`${config.fileStoragePath}`);
  yield next;
});


app.use(function* (next) {
  const type = this.req.headers["content-type"];
  if (type && !type.startsWith("text/") && type !== "application/json") {
    this.rawRequestBody = yield rawBody(this.req);
  }
  yield next;
});

app.use(koaBody({
  includeUnparsed: true,
  urlencoded: false,
  json: false,
}));

const router = new Router();
router.get("/", ctx => ctx.response.body = "I'm alive");

require("./messageHandlers")(router);
require("./contentHandlers")(router);


app.use(router.routes()).use(router.allowedMethods());

const port = config.listenPort;
app.listen(port, () => {
  console.log("Server running on port 7070");
});
