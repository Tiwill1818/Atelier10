var express = require('express');
var app = express();
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    //res.setHeader('Content-Type', 'text/html');
    res.render('./pages/accueil');
});

app.get('/contact', function (req, res) {
    //res.setHeader('Content-Type', 'text/html');
    res.render('./pages/contact');
});
app.get('/about', function (req, res) {
    //res.setHeader('Content-Type', 'text/html');
    res.render('./pages/about');
    
});
app.get('/recherche', function (req, res) {
    //res.setHeader('Content-Type', 'text/html');
    //res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8'});
    res.render('./pages/recherche', {mois: req.query.mois, annee: req.query.annee});
});
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});
var server = app.listen(8080);
var nbClient = 0;
var servNow = new Date();

var io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {
    nbClient++;
    console.log('Un client ' + nbClient + ' est connecté !');
    socket.emit('message', { nbClient: nbClient, servDate: servNow.toLocaleString(), clientDate: new Date().toLocaleString() });
    socket.on('alarme', function (message) {
        console.log('Un client '+ message.idClient +' me parle ! Il me dit : ' + message.temps);   
        
        io.emit('broadcast', { msg: "Nouvelle heure d\'alarme : " + message.temps, heure: message.temps.split(':')[0], minute: message.temps.split(':')[1] , idClient: message.idClient});
    });
    

});







/*var server = http.createServer(function (req, res) {
    var page = url.parse(req.url).pathname;
    var param = url.parse(req.url, true).query;
    console.log(page);
    
    if (page == '/') {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end('<h1> Bienvenue dans mon super site ! </h1>');
    }
    else if (page == '/contact') {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write('<head><meta charset="UTF-8"></head>');
        res.write('<p>Me contacter : <a href="mailto:billgates@hotmail.com">billgates@hotmail.com</a></p>');
        res.end('<br/><a href="/">Retour à l\'accueil</a>');
    }
    else if (page == '/recherche' && param.annee && param.mois) {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end('Vous êtes dans la section recherche. Voici les résultats pour la date de '+param.mois+' '+param.annee);
    }
    else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end('ERREUR 404');
    }
    
});
server.listen(8080);*/