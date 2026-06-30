var http = require('http'), fs = require('fs'), path = require('path');
var p = 8081, r = './';
http.createServer(function(q, s) {
  var f = q.url.split('?')[0];
  if (f === '/') f = '/index.html';
  var fp = path.join(r, f);
  fs.readFile(fp, function(e, d) {
    if (e) { s.writeHead(404); s.end('404'); return; }
    var ext = path.extname(fp);
    var ct = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.json':'application/json','.webmanifest':'application/manifest+json'}[ext] || 'text/plain';
    s.writeHead(200, {'Content-Type': ct});
    s.end(d);
  });
}).listen(p, function() { console.log('Server on http://localhost:' + p); });
