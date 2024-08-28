var express = require('express');
var app = new express();
var fs = require('fs');
var crypto = require('crypto')

let sessions = []

app.use(express.static(__dirname));

app.get('/status', (req, res) => {
    console.log("[INFO] Sending Response '/'")
    res.send(
        {
            "USAGE": {
                "CPU": process.cpuUsage(),
                "MEMORY": process.memoryUsage(),
                "ONTIME": process.hrtime()
            },
            
            "FILES": /*fs.readdirSync(__dirname)*/ getSession(id).files
        }
    )
})

function getSession(id) {
    for (s in sessions) {
        console.log("get " + s)
        if (sessions[s].sessionid === id) {
            return s;
        }
    }
    return null;
}


function existSessions(id) {
    for (s in sessions) {
        console.log("exist " + s)
        if (sessions[s].sessionid === id) {
            return true;
        }
    }
    return false;
}

app.post('/session', (req, res) => {
    let sessionId = crypto.randomBytes(8).toString("hex");
    s = new session(sessionId, [])
    sessions.push(s)
    res.send(
        {
            "ID": sessionId
        }
    )
})

app.post('/upload', (req, res) => {
    console.log("[INFO] checking session id")
    if (existSessions(req.headers['session-id'])) {
        console.log("[INFO] confirm id " + req.headers['session-id'])
    } else {
        res.send(401)
    }
    console.log("[INFO] Getting Data '/upload'")
    let data = []
    //if (req.headers['auth-key'] === "a14fc2af61e79df71ccc31cee4a9e790") { (funny)
        if (req.headers['name'] === "index.html") {
            res.send(401)
        }
        req.on('data', (chunk) => {
            data.push(chunk)
        })
        let length = 0
        req.on("end", () => {
            for (let i = 0; i < data.length; i++ & (length = data.length)) {
                length++
                console.log(length)
                fs.appendFileSync(req.headers['name'], Uint8Array.from(data[i]))
            }
            console.log(sessions)
            console.log(getSession(req.headers['session-id']))
            console.log(getSession(req.headers['session-id']).files);
            console.log("[INFO] Sending Response '/upload':  { \"CHUNK_ARRAY_SIZE\":" + `${length}` + ", \"URL\":" + `::3030/${req.headers['name']} }`)
            res.send(
                {
                    "CHUNK_ARRAY_SIZE": data.length,
                    "URL": `::3030/${req.headers['name']}`
                }
            )
        });
        
    //} else {
    //    res.send(401)
    //}
})

var server = app.listen(3030, function() {
    console.log('Serving funnatural on port %d', server.address().port);
});

class session {
    files = [];
    sessionid;
    /**
     * 
     * @param {string} sessionid 
     * @param {string[]} files 
     */
    constructor(sessionid, files) {
        this.files = files;
        this.sessionid = sessionid;
    }
}