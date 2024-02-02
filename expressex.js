var express=require('express');
var app=express()
var fs = require('fs');
var qs = require('querystring');
var template = require('./lib/template.js');
var bodyParser= require('body-parser');
var compression=require('compression');
var topicRouter=require('./routes/topic')
var path = require('path');
var sanitizeHtml = require('sanitize-html');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(compression())
app.get('*',function(request,response,next){
  fs.readdir('./data', function(error, filelist){
    request.list=filelist
    next()
   })
})
//topic으로 시작하는 링크에서 토픽라우터라는 미들웨어적용
app.use('/topic', topicRouter)

app.get('/', function(request,response){
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
    `,
    `<a href="/topic/create">create</a>`
  );
  response.send(html);
  
});


app.use(function(request,response,next){
  response.status(404).send('Sorry cant find that!');
})

app.use(function(err, req,res,next){
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
app.listen(3000, ()=>console.log('Example app listening on port 3000!'))

/*
var http = require('http');
var fs = require('fs');
//var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var urlObj = new URL('http://localhost:4000' + _url);
    var queryData=urlObj.searchParams;
    var pathname= urlObj.pathname;
    if(pathname === '/'){
      if(!urlObj.searchParams.has('id')){
        
      } else {
        
      }
    } else if(pathname === '/create'){
      
    } else if(pathname === '/create_process'){
      
    } else if(pathname === '/update'){
      
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var filteredId = path.parse(id).base;
          fs.unlink(`data/${filteredId}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(4000);*/
