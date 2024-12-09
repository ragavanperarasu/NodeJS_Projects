const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.sendFile('./public/index.html');
})

app.get('/video', (req, res)=>{
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Required Range header");
    }
    const videoPath = "./public/mah_001.mp4";
    const videoSize = fs.statSync("./public/mah_001.mp4").size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Range": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video.mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, {start, end});
    videoStream.pipe(res);
})

app.listen(3000, () => console.log("Server Starting at 3000"));
