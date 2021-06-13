const { writeFile, readFileSync, readFile, watch } = require("fs");
const { createServer } = require("http");
const https = require("https");
const sharp = require('sharp');
const request = require('superagent');

const dataFileName = "instagram-data.json";
const PORT = 3000;

setInterval(() => {
    let accessToken = '';
    readFile('access-token.txt', {encoding : "utf-8"}, (error, data) => accessToken = data || console.log( new Date().toLocaleTimeString() + error));
    
    https.get(
      "https://graph.instagram.com/17841401243459210/media?fields=media_type,media_url,permalink,timestamp,caption&limit=12&access_token=" + accessToken,
      (res) => {
        let data = "";
        res.setEncoding("utf-8");
        res.on("data", (chunk) => (data += chunk));

        const files = JSON.parse(data).data;

        files.forEach(file => {
            console.log(file);
        })

        res.on("end", () =>
          writeFile(dataFileName, data, (error) =>
            console.log(error || new Date().toLocaleTimeString() + " Instagram data written successfully"
            )))})},
  60000);

//   let imagesData = readFileSync(dataFileName, {encoding: "utf-8"});
//   images = JSON.parse(imagesData).data;

//   images.forEach((file, i) => {
//       if (file.media_type === "IMAGE") {
    //   https.get(file.media_url, res => {
        // const transformer = sharp().resize(300, 300).webp().toFile('img.webp', err => console.log(err));

        // request('https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/SA-Logo.svg/360px-SA-Logo.svg.png://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80').pipe(transformer).on('error', error => console.log("Error", error)).on("finish", data => console.log("data", data))

        // const transformer = sharp().resize(300, 300).webp().toBuffer().then(res => console.log(res))
    //   https.get('https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/SA-Logo.svg/360px-SA-Logo.svg.png://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', res => {
    //       let fileBuffer = '';
    //       res.on('data', data => fileBuffer = data)
    //       res.on("end", () => {
            //   console.log(fileBuffer);
            // request('https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/SA-Logo.svg/360px-SA-Logo.svg.png://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80').pipe(transformer).on('error', error => console.log(error)).on("finish", data => console.log(data))
            //   sharp(fileBuffer).toFile(i + '.webp', error => console.log(error))
        //   })
    //   })}
    // console.log(file.media_url.split('?')[0]);
    // sharp({ url : file.media_url, ""}).toFile(i + '.webp', error => console.log(error))
// })

createServer((req, res) => {
    if (req.url === "/instagramData" && req.method === "GET") {
        let instagramData = readFileSync(dataFileName, {encoding: "utf-8"});
        instagramData = JSON.parse(instagramData).data;
        
        res.end(JSON.stringify(instagramData));
    }

    if (req.url === "/newAccessToken" && req.method === "POST") {
        req.setEncoding('utf-8');
        req.on('data', data => writeFile("access-token.txt", data, (error) => error && console.log(error)));
        res.writeHead(200).end("New Access Token Writen Successfully")
    }
}).listen(PORT)
  .on("listening", () =>
    console.log(new Date().toLocaleTimeString() + " Listening on port " + PORT)
  );