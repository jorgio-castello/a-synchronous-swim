const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg'); //./background.jpg
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  // console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if(req.method === 'GET' && req.url === '/') {
    res.writeHead(200, headers);
    res.end(messageQueue.dequeue());
  }

  if (req.method === 'GET' && req.url === '/background'){ //./background.jpg - look up in the file system

    if(!fs.existsSync(module.exports.backgroundImageFile)) {
      res.writeHead(404, headers);
      res.end();
    } else {
      // res.writeHead(200, headers);
      // // Create/upload image?
      // let image = fs.readFileSync(module.exports.backgroundImageFile);
      res.writeHead(200, 'image/jpg');
      let data = fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        return data;
      });
      console.log(data);
      res.end(data);
    }


  }

  if(req.method === 'POST' && req.url === '/uploadImage') {
    //Step 1: Save data into our server somehow
    let data = req._postData;
    fs.writeFile(module.exports.backgroundImageFile, data, (err, data) => {
      if(err) throw err;
    });

    console.log(data);
    res.writeHead(201, headers);
    res.end();
  }

  if(req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end('GET');
  }
  next(); // invoke next() at the end of a request to help with testing!
};
