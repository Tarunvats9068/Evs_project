const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/evs_project');
const db = mongoose.connection;
db.on('error',console.error.bind(console,'error in connecting with databases'));
db.once('open',function(){
    
    console.log('databases are connected succesfully');

});
