function dbConnect() {
    // database connections
    const mongoose = require('mongoose')
    const url = 'mongodb://localhost/comments'

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    })

    const connection = mongoose.connection
    connection.once('open', () => {
        console.log('Database Connected.');
    }).catch((err) => {
        console.log(err);
    })
}

module.exports=dbConnect
