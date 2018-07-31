const fs = require('fs');
const path = require('path');
const PassThrough = require('stream').PassThrough;
const koa = require('koa');
const Router = require('koa-router');
const app = new koa();
const router = new Router();

router.get('/',function(ctx,next){
    ctx.set('content-type','text/html');
    ctx.body = fs.readFileSync('./index.html');
});

router.get('/sendMessage',function(ctx,next){
    console.log('EventSource connected')
    const stream = new PassThrough();

    const timer = setInterval(()=>{
        // 一共2个事件， 默认的message，和自定义的myEvent
        // \n\nevent: 在\n\n和event之间不能有空格
        // 多个事件可以写在一块，也可以单独发
        // stream.write(`data: ${new Date().toLocaleTimeString()} \n\nevent: myEvent\ndata: ${new Date().toLocaleString()}\n\n`)
        // stream.write(`data: ${new Date().toLocaleTimeString()} \n\n`)
        // stream.write(`event: myEvent\ndata: ${new Date().toLocaleString()}\n\n`)
        // 或者用push
        stream.push(`data: ${new Date().toLocaleTimeString()} \n\nevent: myEvent\ndata: ${new Date().toLocaleString()}\n\n`)
        // stream.push(`data: ${new Date().toLocaleTimeString()} \n\n`)
        // stream.push(`event: myEvent\ndata: ${new Date().toLocaleString()}\n\n`)
    }, 2000); 


    ctx.req.on('close', () => {
        console.log('EventSource closed')
        clearInterval(timer)
        ctx.res.end()
    });
    ctx.req.on('finish', () => {
        console.log('finish')
        ctx.res.end()
    });
    ctx.req.on('error', () => {
        console.log('error')
        ctx.res.end()
    });
    ctx.type = 'text/event-stream';
    ctx.body = stream;
});

app.use(router.routes());
app.listen(3000,function(){
    console.log('listening port 3000');
});