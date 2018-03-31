var express = require('express')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var request = require('request')
var moment = require('moment')
var PORT = process.env.PORT || 3000
var FCM = require('fcm-push')
var fcm = new FCM('AAAATndmh-M:APA91bHb_8-HgWdvPuoHT5vzaPqMXnDcD_pTU2pbQZBDvSbs2KwhE4T9-bZzI_RC1ZCraHWRMKqHwfFl-2Ode5TvoFyjtt4mJRft825mgrBigbMBkwxubTTUM4eqQ6EMT7-30u0uDwcN\n')
var app = express();
var db = require('./db');

var randomstring = require('randomstring');

app.use(bodyParser.urlencoded({
    extended : false
}))

app.use(morgan('dev'))

app.listen(PORT, ()=>{
    console.log('Server Running At '+PORT+' Port!')
})

require('./routes/auth')(app, db , randomstring);
require('./routes/danger')(app, db, fcm, moment, request)