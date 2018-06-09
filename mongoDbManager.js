var mongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

mongoClient.connect("mongodb://sammy-db:Fj6u2H1QXuOWZB9WgK4e8nIk3BPmJjMED5KsRyQr158I9FDwmQta1Ih4ZRDYq1pPlHqtO8CpyttDWIVMgepGkQ%3D%3D@sammy-db.documents.azure.com:10255/?ssl=true")
    .then(conn => global.conn = conn.db("sammy-db"))
    .catch(err => console.log(err))

function insertComments(book, callback) {
    global.conn.collection("Comments").insert(book, callback);
}

function findAllComments(params, callback) {
    global.conn.collection("Comments").find(params).toArray(callback);
}

function findById(id, callback){
    global.conn.collection("Comments").find(new ObjectId(id)).toArray(callback);
}

function updateBook(book, callback) {
    var updateFilter = {
        _id: new ObjectId(book._id)
    };

    var updateOperation = {
        $set: {
            title: book.title,
            author: book.author,
            tags: book.tags
        }
    };

    global.conn.collection("Comments").updateOne(updateFilter, updateOperation, callback);
}

function deleteComments(id, callback) {
    var deleteFilter = {
        _id: new ObjectId(id)
    };
    
    global.conn.collection("Comments").deleteOne(deleteFilter, null, callback);
}

function deleteAll(callback) {
    global.conn.collection("Comments").remove({}, callback);
}

module.exports = { insertComments, findAllComments, findById, updateBook, deleteComments, deleteAll };