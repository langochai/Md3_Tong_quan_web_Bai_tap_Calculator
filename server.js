const http = require('http')
const fs = require('fs')
const qs = require('qs')

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        fs.readFile('./src/calculator.html', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    } else {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            const userInfo = qs.parse(data);
            fs.readFile('./src/calculator.html', 'utf8', (err, datahtml) => {
                if (err) {
                    console.log(err);
                }
                if (isNaN(userInfo.firstArg) || isNaN(userInfo.secondArg)) datahtml = datahtml.replace('{result}', "Wtf you need to put numbers in there!!!");
                else switch (userInfo.operator) {
                    case "+":
                        datahtml = datahtml.replace('{result}', ((+userInfo.firstArg) + (+userInfo.secondArg)).toString());
                        break
                    case "-":
                        datahtml = datahtml.replace('{result}', ((+userInfo.firstArg) - (+userInfo.secondArg)).toString());
                        break
                    case "*":
                        datahtml = datahtml.replace('{result}', ((+userInfo.firstArg) * (+userInfo.secondArg)).toString());
                        break
                    case "/":
                        datahtml = datahtml.replace('{result}', ((+userInfo.firstArg) / (+userInfo.secondArg)).toString());
                        break
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(datahtml);
                return res.end();
            });
        })
        req.on('error', () => {
            console.log('error')
        })
    }
});

server.listen(8080, function () {
    console.log('server running at localhost:8080 ')
});