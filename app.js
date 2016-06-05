var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var S = require('string');
var moment = require('moment');
var LineByLineReader = require('line-by-line');

var app = express();
var test;


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




    fs.exists('mail.txt', function (exists) {


        //getting current time
        var time = moment();
        var formatted = time.format('YYYY-MM-DD HH:mm:ss Z');

        //formatting texts
        var data = strFormat(formatted)+strFormat(fromMail)+strFormat(toMail)+addBracks(message);

        //checking if file exists and appending if it does
        if (exists){fs.appendFile('mail.txt', data+'\r\n', function (err) {

            if(err)
                throw err;
            else
                console.log('file appended');
        });} else {
            fs.writeFile('mail.txt', data, function (err) {
                if(err){
                    throw err;
                }
                console.log('file created!');
            } );
        }

    });



    var html =  fromMail + ' you sent  '+ message +' to ' + toMail + '.<br>' +
        '<a href="/">Send Another Mail</a><br><a href="/list">View All Sent Mails</a> ';
    res.send(html);
    console.log('data added');

});
    

app.get('/list', function (req, res) {

    /** Displaying mail data in a sexy way <<uncompleted>>
     * 
     * var lr = new LineByLineReader('mail.txt');
    lr.on('error', function (err) {
        console.log(err.stack);
    });

    lr.on('line', function (line) {
        test = line.toString();
        console.log(test);

        // 'line' contains the current line without the trailing newline character.
    });

    lr.on('end', function () {
        console.log('end of reading');
    });

    helloCatAsync(function (result) {


        console.log(result);
    })
**/







    var  mailtext = fs.readFileSync('mail.txt');
    var formatted = mailtext.toString();


    var html = test+'<br>' + formatted + '<br>' +
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

function readFile(filePath) {



}

function helloCatAsync(callback) {
    // 3. Start async operation:
    setTimeout(function() {
        // 4. Finished async operation,
        //    call the callback passing the result as argument
        callback(test);
    }, Math.random() * 2000);
}