module.exports = function(Users, async) {
    return {
        setRouting: function(router){
            router.get('/group/:name', this.groupPage);
            router.post('/group/:name', this.groupPostPage);
        },

        groupPage: function(req, res) {
            const name = req.params.name; // sini req param drpde ats tu
            res.render('groupchat/group', {title: 'Chat - Group', user:req.user, groupName:name});
        },
        groupPostPage: function(req, res){ 
            async.parallel([
                function(callback){
                    if(req.body.recieverName){
                         Ussers.update({
                             'username': req.body.recieverName,
                             'request.userId': {$ne : req.user._id},
                             'friendsList.friendId': {$ne: req.user_id}
                         },
                         {
                             $push: {request: {
                                 userId: req.user._id,
                                 username: req.user.username
                             }},
                             $inc: {totalRequest: 1}
                        }, (err, count) => 
                        { callback(err, count);
                        })
                    }
                },

                function(callback){
                    if(req.body.recieverName){
                        Users.update({
                            'username': req.user.username,
                            'sentRequest.username': {$ne: req.body.recieverName}
                        },{
                             $push: {sentRequest: {
                            username: req.body.recieverName
                             }}
                        }, (err, count) => {
                            callback(err,count);
                        }
                         )
                    }
                }

            ],(err, results) => {
                res.redirect('/group/'+req.params.name);
            });
        }
    }
}