const {streamEvents} = require("http-event-stream");


let counter = 0;

function sse(ctx) {
  //console.log('see 1')

  streamEvents(ctx.req, ctx.res, {
    async fetch() { return []; },

    stream(streamContext) {
      const listener = (options) => {
        //console.log("listener", options.msg.content.text);
        streamContext.sendEvent({
          data: JSON.stringify(options),
          event:options.event
        });
        //console.log('listener','after')
      };

      console.log("on", ++counter);
      ctx.emitter.on("message", listener);
      //console.log('stream 2')
      // Return an unsubscribe function, so the stream can be terminated properly
      return () => {
        console.log("off", --counter);

        ctx.emitter.off("message", listener);
      }
    }
  });
  ctx.respond = false;
}


module.exports = function (router) {
  router.get("/api/sse", sse);
};
