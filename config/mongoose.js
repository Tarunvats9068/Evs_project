const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://9315vats:DGHGs85JxDQ3kTxT@cluster1.wztua67.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on('error',console.error.bind(console,'error in connecting with databases'));
db.once('open',function(){
    
    console.log('databases are connected succesfully');

});
