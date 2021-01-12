// routes/index.js
module.exports = function(app, User)
{
    // // GET ALL BOOKS
    // app.get('/api/books', function(req,res){
    //     Book.find(function(err, books){
    //         if(err) return res.status(500).send({error: 'database failure'});
    //         res.json(books);
    //     })
    // });

    // // GET SINGLE BOOK
    // app.get('/api/books/:book_id', function(req, res){
    //     Book.findOne({_id: req.params.book_id}, function(err, book){
    //         console.log(book);
    //         if(err) return res.status(500).json({error: err});
    //         if(!book) return res.status(404).json({error: 'book not found'});
    //         res.json(book);
    //     })
    // });

    // // // GET BOOK BY AUTHOR
    // app.get('/api/books/author/:author', function(req, res){
    //     Book.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1},  function(err, books){
    //         if(err) return res.status(500).json({error: err});
    //         if(books.length === 0) return res.status(404).json({error: 'book not found'});
    //         res.json(books);
    //     })
    // });

    // Provide user information(contact & gallery) given the uid.
    app.post('/login', function(req, res){
        var date = new Date();
        var dateStr =
            ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + "/" +
            date.getFullYear() + " " +
            ("00" + date.getHours()+9).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);
        console.log(dateStr);
        console.log("login post start");
        //Find the documents containing this uid in 'users' collection.
        User.findOne({uid: req.body.uid}, function(err, user){
            // console.log("uid: ",user.uid,", req.body: ",req.body);
            if(err) {
                console.log("error");
                return res.status(500).json({error: err});
            }
            if(!user){ //if there's no such user
                console.log("no such user")
                var user = new User();
                user.uid = req.body.uid;
                user.name = req.body.name;
                user.profile = req.body.profile;
                user.save(function(err){ // Save new user document in 'users' collection.
                    if(err){
                        console.error(err);
                        console.log("save error");
                        res.json({result: 0});
                        return;
                    }
                });
                console.log("before returning new");
                return res.json(user);
            }
            console.log("user exists");
            return res.json(user);
        })
    });

    //Provide updated user object with synchronized contacts given current contacts in phone.
    app.post('/sync/contacts', function(req, res){ //req = {uid:~, contact:~}
        var date = new Date();
        var dateStr =
            ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + "/" +
            date.getFullYear() + " " +
            ("00" + date.getHours()+9).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);
        console.log(dateStr);
        console.log("contact sync post start");
        var curr_contact = req.body.contacts;
        console.log("curr contact: ", curr_contact);
        console.log("req uid: ", req.body.uid);
        User.findOne({uid: req.body.uid}, function(err, user){
            if(err) {
                console.log("error");
                return res.status(500).json({error: err});
            }
            if(!user){ //if there's no such user
                console.log("no such user")
                return res.status(500).json({error: err});
            }
            console.log("user exists");
            //Union of two contacts
            var db_contact = user.contacts;
            console.log("db contact: ", db_contact);
            var final_contact = union_contacts(curr_contact, db_contact);
            //Method 1
            // var difference = curr_contact.filter(x => !db_contact.includes(x));
            // console.log("curr-db = ", difference);
            // final_contact = difference.concat(db_contact);
            //Method 2
            // var final_contact = [...new Set(curr_contact.concat(db_contact))];
            console.log("final_contact = ",final_contact);
            //Update db
            user.contacts = final_contact;
            user.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
            });
            //Send updated user object as a response to the client.
            return res.json(user);
        })
    });


    //Provide updated user object with synchronized gallery given current gallery in phone.
    app.post('/camera', function(req, res){ //req = {uid:~, contact:~}
        var date = new Date();
        var dateStr =
            ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + "/" +
            date.getFullYear() + " " +
            ("00" + date.getHours()+9).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);
        console.log(dateStr);
        console.log("gallery sync post start");
        console.log("req uid: ", req.body.uid);
        var curr_gallery = req.body.gallery;    //java List<String>
        console.log("curr gallery length: ", curr_gallery.length);
        
        User.findOne({uid: req.body.uid}, function(err, user){
            if(err) {
                console.log("error");
                return res.status(500).json({error: err});
            }
            if(!user){ //if there's no such user
                console.log("no such user")
                return res.status(500).json({error: err});
            }
            console.log("user exists");
            //Union of two gallery
            var db_gallery = user.gallery; //JSON array of string
            console.log("db gallery length: ", db_gallery.length);
            //Method 0
            // var final_gallery = union_arrays(curr_gallery, db_gallery);
            //Method 1
            // var difference = curr_gallery.filter(x => !db_gallery.includes(x));
            // console.log("curr-db = ", difference);
            // final_gallery = difference.concat(db_gallery);
            //Method 2
            var final_gallery = [...new Set(curr_gallery.concat(db_gallery))];
            console.log("final_gallery = ",final_gallery.length);
            //Update db
            user.gallery = final_gallery;
            user.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
            });
            //Send updated user object as a response to the client.
            return res.json(user);
        })
    });


    app.post('/download/gallery', function(req, res){ //req = {uid:~, contact:~}
        var date = new Date();
        var dateStr =
            ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + "/" +
            date.getFullYear() + " " +
            ("00" + date.getHours()+9).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);
        console.log(dateStr);
        console.log("gallery sync post start");
        console.log("req uid: ", req.body.uid);
        User.findOne({uid: req.body.uid}, function(err, user){
            if(err) {
                console.log("error");
                return res.status(500).json({error: err});
            }
            if(!user){ //if there's no such user
                console.log("no such user")
                return res.status(500).json({error: err});
            }
            console.log("user exists");
            console.log("db gallery length: ", user.gallery.length);
            //Send updated user object as a response to the client.
            return res.json(user);
        })
    });

    app.post('/find/friend', function(req, res){
        var date = new Date();
        var dateStr =
            ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + "/" +
            date.getFullYear() + " " +
            ("00" + date.getHours()+9).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);
        console.log(dateStr);
        console.log("/find/friend post start");
        console.log("req name: ", req.body.name);
        User.find({name: req.body.name}, function(err, users){
            if(err) {
                console.log("error");
                return res.status(500).json({error: err});
            }
            if(users.length==0){ //if there's no such user
                console.log("no such user")
                return res.status(500).json({error: err});
            }
            var profiles = new Array();
            for (i = 0, len = users.length; i < len; i++) {
                profiles.push(users[i].profile);
            }
            console.log("such friend exists");
            return res.json({profiles: profiles});
            
        })
    })
    app.post('/make/friend', function(req, res){
        var date = new Date();
        var dateStr =
            ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + "/" +
            date.getFullYear() + " " +
            ("00" + date.getHours()+9).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);
        console.log(dateStr);
        console.log("/make/friend post start");
        console.log("req name: ", req.body.name);
        console.log("req relation : ", req.body.relation);
        var userprofile = req.body.relation[0]; 
        var friendprofile = req.body.relation[1];
        
        // user의 myfriend에 frienduid를 추가 
        User.findOne({profile: userprofile}, function(err, user){
            console.log("check");
            if(err) {
                console.log("error");
                return res.status(500).json({error: err});
            }
            if(!user){ //if there's no such user
                console.log("no such user")
                return res.status(500).json({error: err});
            }
            console.log("user exists");
            //Union of two friends
            var user_friends = user.myfriends; //JSON array of string
            console.log("user_friends: ", user_friends);

            var final_user_friends = [...new Set(user_friends.concat(friendprofile))];
            console.log("final_user_friends = ",final_user_friends);
            //Update db
            user.myfriends = final_user_friends;
            user.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
            });
            //Send updated user object as a response to the client.
            // return res.json(user);
        })
        console.log("check");
        // friend의 myfriend에 useruid를 추가 
        User.findOne({profile: friendprofile}, function(err, user){
            if(err) {
                console.log("error");
                return res.status(500).json({error: err});
            }
            if(!user){ //if there's no such user
                console.log("no such user")
                return res.status(500).json({error: err});
            }
            console.log("friend exists");
            //Union of two friends
            var friend_friends = user.myfriends; //JSON array of string
            console.log("friend_friends: ", friend_friends);

            var final_friend_friends = [...new Set(friend_friends.concat(userprofile))];
            console.log("final_friend_friends = ",final_friend_friends);
            //Update db
            user.myfriends = final_friend_friends;
            user.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
            });
            //Send updated user object as a response to the client.
            return res.json(user);
        })
    })


}

function union_contacts(x, y) {
    var obj = {};
    for (var i = x.length-1; i >= 0; -- i)
        obj[x[i][0]] = x[i][1];
    for (var i = y.length-1; i >= 0; -- i)
        obj[y[i][0]] = y[i][1];
    var res = []
    for (var k in obj) {
        if (obj.hasOwnProperty(k))  // <-- optional
        res.push([k, obj[k]]);
    }
    return res;
}

// function union_galleries(x, y) {
//     var obj = {};
//     for (var i = x.length-1; i >= 0; -- i)
//         obj[x[i][0]] = x[i][1];
//     for (var i = y.length-1; i >= 0; -- i)
//         obj[y[i][0]] = y[i][1];
//     var res = []
//     for (var k in obj) {
//         if (obj.hasOwnProperty(k))  // <-- optional
//         res.push([k, obj[k]]);
//     }
//     return res;
// }

        // console.log("post start");
        // var user = new User();
        // // user.uid = req.body.uid;
        // user.uid = req.body;
        // user.save(function(err){ // 데이터를 데이터베이스에 저장함.
        //     if(err){
        //         console.error(err);
        //         console.log("save error");
        //         res.json({result: 0});
        //         return;
        //     }
        // });
        // console.log("before ending");
        // res.json(user);
        // res.end();


    // // UPDATE THE BOOK
    // app.put('/api/books/:book_id', function(req, res){
    //     Book.findById(req.params.book_id, function(err, book){
    //         if(err) return res.status(500).json({ error: 'database failure' });
    //         if(!book) return res.status(404).json({ error: 'book not found' });
    //         if(req.body.name) book.title = req.body.name;
    //         if(req.body.author) book.author = req.body.author;
    //         if(req.body.published_date) book.published_date = req.body.published_date;
    //         book.save(function(err){
    //             if(err) res.status(500).json({error: 'failed to update'});
    //             res.json({message: 'book updated'});
    //         });
    //     });
    // });
    // // DELETE BOOK
    // app.delete('/api/books/:book_id', function(req, res){
    //     Book.remove({ _id: req.params.book_id }, function(err, output){
    //         if(err) return res.status(500).json({ error: "database failure" });
    //         /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
    //         if(!output.result.n) return res.status(404).json({ error: "book not found" });
    //         res.json({ message: "book deleted" });
    //         */
    //         res.status(204).end();
    //     })
    // });