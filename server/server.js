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

const koaSessionConfig = {
  key: "koa.sess", /** (string) cookie key (default is koa.sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 8640000000,
  autoCommit: true,
  /** (boolean) automatically commit headers (default true) */
  overwrite: true,
  /** (boolean) can overwrite or not (default true) */
  httpOnly: false,
  /** (boolean) httpOnly or not (default true) */
  signed: false,
  /** (boolean) signed or not (default true) */
  rolling: true,
  /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false,
  /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  secure: true,
  /** (boolean) secure cookie*/
  sameSite: 'None', /** (string) session cookie sameSite options (default null, don't set it) */
};

app.use(session(koaSessionConfig, app));

app.use(function* (next) {
  if (!this.session.id) {
    this.session.id = uuid.v4().toString();
  }
  console.log(this.session.id, this.request.url);

  this.db = new Database(`${config.databasePath}/${this.session.id}.json`);
  this.storage = new FileStorage(`${config.fileStoragePath}/${this.session.id}`);
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
