const http = require('http');
const fs = require('fs');
const port = 3000;

http.createServer(function (req, res) {
    if(req.url === '/sendMessage') {
        res.writeHead(200, {
            "Content-Type": "text/event-stream" //设置头信息
        });

        setInterval(function () {
            res.write(
                //事件一
                "data:" + new Date().toLocaleTimeString() + "\n\n" + //必须“\n\n”结尾
                //事件二
                ": '这是注释！'" + "\n" +
                "event: myEvent" + "\n" + 
                "data:" + new Date().toLocaleString() + "\n\n"
            );
        }, 1000);
    } else {
        fs.readFile('./index.html', function (err, content) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content, 'utf-8');
        });
    }

}).listen(port);

console.log(`Listening on localhost:${port}`)