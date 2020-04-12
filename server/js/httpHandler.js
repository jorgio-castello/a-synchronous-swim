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


module.exports.router = (req, res, next = () => {}) => {
  if(req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end('GET');
    next();
  }

  if(req.method === 'GET') {
    if(req.url === '/') {
      res.writeHead(200, headers);
      res.end(messageQueue.dequeue());
    } else if(req.url === '/background.jpg') {
      fs.readFile(module.exports.backgroundImageFile, (err, fileData) => {
        if(err) {
          res.writeHead(404, headers);
        } else {
          res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': fileData.length
          });
          res.write(fileData, 'binary');
        }
        res.end();
        next();
      });
    }
  }

  if(req.method === 'POST' && req.url === '/uploadImage') {
    let imageData = Buffer.alloc(0);
    req.on('data', chunk => {
      imageData = Buffer.concat([imageData, chunk]);
    });

    req.on('end', () => {
      let file = multipart.getFile(imageData);
      fs.writeFile(module.exports.backgroundImageFile, file.data, err => {
        res.writeHead(err ? 400 : 201, headers);
        res.end();
        next();
      });
    });
  }
}
