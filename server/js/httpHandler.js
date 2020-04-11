const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
// const formidable = require('formidable');

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

  if (req.method === 'GET' && req.url === '/background.jpg'){ //./background.jpg - look up in the file system
    fs.readFile(module.exports.backgroundImageFile, (err, fileData) => {
      if(err) {
        res.writeHead(404, headers);
      }

      res.end();
      next();
    });
    // if(!fs.existsSync(module.exports.backgroundImageFile)) {
    //   res.writeHead(404, headers);
    //   res.end();
    //   next();
    // } else {
    //   console.log(module.exports.backgroundImageFile);
    //   fs.readFile(module.exports.backgroundImageFile, (err, fileData) => {
    //     res.writeHead(200, {
    //       'Content-Type': 'image/jpeg',
    //       'Content-Length': fileData.length
    //     });
    //     res.write(fileData, 'binary');
    //   });
    //   res.end();
    //   next();
    // }
  }

  if(req.method === 'POST' && req.url === '/uploadImage') {
    //Declare data and set it equal to buffer
    let imageData = Buffer.alloc(0);
    //We need concat each chunk to the data
    req.on('data', chunk => {
      imageData = Buffer.concat([imageData, chunk]);
    });

    //Handle when the data finishes arriving
    req.on('end', () => {
      let file = multipart.getFile(imageData);
      fs.writeFile(module.exports.backgroundImageFile, file.data, err => {
        res.writeHead(201, headers);
        res.end();
        next();
      });
    });
  }

  if(req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end('GET');
  }
  next(); // invoke next() at the end of a request to help with testing!
};
