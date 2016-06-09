var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var S = require('string');
var moment = require('moment');
var LineByLineReader = require('line-by-line');


var app = express();


app.use(bodyParser());


app.get('/', function(req, res){


    res.sendfile('index.html');
    console.log('app launched');
});

app.post('/', function(req, res) {
    var fromMail = req.body.from;
    var toMail = req.body.to;
    var message = req.body.message;


    /* format = [date and time]---[from email]---[target email address]---[message]*/


//check if file exists

    fs.exists('mail.txt', function (exists) {


        //getting current time
        var time = moment();
        var timestamp = time.format('YYYY-MM-DD HH:mm:ss Z');

        //formatting texts
        var data = strFormat(timestamp)+strFormat(fromMail)+strFormat(toMail)+ addBracks(message);

        //checking if file exists and appending if it does
        if (exists){fs.appendFile('mail.txt', data+'\r\n', function (err) {

            if(err)
                throw err;
            //if not create  a new mail.txt
        });} else {
            fs.writeFile('mail.txt', data, function (err) {
                if(err){
                    throw err;
                }
                console.log('file created!');
            } );
        }

    });


    //display mail after submitting
    var html =  fromMail + ' you sent  '+ message +' to ' + toMail + '.<br>' +
        '<a href="/">Send Another Mail</a><br><a href="/list">View All Sent Mails</a> ';
    res.send(html);
    console.log('data added');

});


app.get('/list', function (req, res) {



    //reading file and sending to html page
    var  mailtext = fs.readFileSync('mail.txt');
    var formatted = mailtext.toString();
    var line = formatted.replace(new RegExp('\r?\n','g'), '<br>');
    var html = line + '<br>' +
        '<a href="/">Send a mail</a>';
    res.send(html);




});



app.listen(8888, function () {
    console.log('listening on port 8888');
});


function strFormat(string) {
   var text =  addBracks(string)+S('-').times(3).s;
    return text;
}
function addBracks(string) {
    var newString = '['+string+']';
    return newString;
}
function addHtmlBreak(string) {
    var text = string + '<br>';
    return text;

}

function displayData(callback) {


    lr = new LineByLineReader('mail.txt');
    var lines =[];
    lr.on('error', function (err) {
        // 'err' contains error object
    });

    lr.on('line', function (line) {
        // pause emitting of lines...


        lines.push(line);
        lr.pause();
        callback(lines);

        // ...do your asynchronous line processing..
        setTimeout(function () {

            // ...and continue emitting lines.
            lr.resume();
        }, 100);
    });

    lr.on('end', function () {
        callback(lines);

        // All lines are read, file is closed now.
    });

}

