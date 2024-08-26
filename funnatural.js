var express = require('express');
var app = new express();
var fs = require('fs');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    console.log("[INFO] Sending Response '/'")
    res.send(
        {
            "USAGE": {
                "CPU": process.cpuUsage(),
                "MEMORY": process.memoryUsage(),
                "ONTIME": process.hrtime()
            },
            
            "FILES": fs.readdirSync(__dirname)
        }
    )
})

app.put('/upload', (req, res) => {
    console.log("[INFO] Getting Data '/upload'")
    var data = []
    //if (req.headers['auth-key'] === "a14fc2af61e79df71ccc31cee4a9e790") { (funny)
        req.on('data', (chunk) => {
            data.push(chunk)
        })

        req.on("end", () => {
            for (let i = 0; i < data.length; i++) {
                fs.appendFileSync(req.headers['name'], Uint8Array.from(data[i]))
            }
        });

        console.log("[INFO] Sending Response '/upload':  { \"URL\":" + `::3030/${req.headers['name']} }`)
        res.send(
            {
                "URL": `::3030/${req.headers['name']}`
            }
        )
    //} else {
    //    res.send(401)
    //}
})

var server = app.listen(3030, function() {
    console.log('Serving funnatural on port %d', server.address().port);
});