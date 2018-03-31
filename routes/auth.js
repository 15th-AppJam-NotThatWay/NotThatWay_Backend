module.exports = auth

function auth(app, db , randomstring) {

    app.post('/auth/register', (req, res)=>{
        var body = req.body
        console.log(body)
        db.User.findOne({
            id : body.id
        },(err, data)=>{
            if(err){
                throw err
            }
            else if(data){
                res.send(409, {success:false, message:"이미 존재하는 유저입니다."})
            }
            else {
                if(body.type == true){
                    var save_user = new db.User({
                        username : body.username,
                        id : body.id,
                        usertoken : randomstring.generate(8),
                        password : body.password,
                        usertype: body.type,
                        fcmtoken : "",
                        guardiantoken : ""
                    });
                    console.log(save_user)
                    save_user.save((err)=>{
                        if(err) throw err;
                        res.send(200, {success:true, message:"회원가입에 성공했습니다."});
                    });
                }
                else if(body.type == false){
                    var disabled_token = randomstring.generate(8)
                    var save_user = new db.User({
                        username : body.username,
                        usertoken : disabled_token,
                        id : body.id,
                        password : body.password,
                        usertype: body.type,
                        fcmtoken : "",
                        guardiantoken : body.guardiantoken
                    });
                    db.User.update({
                        usertoken : body.guardiantoken
                    }, {$set:{guardiantoken:disabled_token}}, (err)=>{
                        if(err){
                            throw err
                        }
                        else {
                            save_user.save((err)=>{
                                if(err) throw err;
                                res.send(200, {success:true, message:"회원가입에 성공했습니다."});
                            });
                        }
                    })
                }

            }
        })
    })

    app.post('/auth/login', (req, res)=>{
        var body = req.body
        db.User.findOne({
            id : body.id,
            password : body.password
        }, (err, data)=>{
            if(err){
                throw err
            }
            else if(data){
                res.send(200, data)
            }
            else {
                res.send(401, {success:false, message:"존재하지 않는 유저입니다."})
            }
        })
    })

    app.post('/auth/fcmupdate', (req, res)=>{
        var body = req.body
        db.User.findOne({
            id : body.id
        }, (err, data)=>{
            if(err) throw err
            else if(data){
                db.User.update({
                    id : body.id
                },{$set:{fcmtoken:body.fcmtoken}}, (err)=>{
                    if(err) throw err
                    else{
                        res.send(200, {success:true, message:"FCM토큰이 정상적으로 업데이트 되었습니다."})
                    }
                })
            }
            else {
                res.send(401, {success:false, message:"존재하지 않는 유저입니다."})
            }
        })
    })



}