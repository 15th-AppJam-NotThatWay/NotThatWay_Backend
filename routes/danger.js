module.exports = danger

function danger(app, db, fcm, moment, request) {

    //장애인id, 위도, 경도
    app.post('/danger/push', (req, res)=>{

        var json, tmpname="";

        var body = req.body

        var options = {
            method: 'GET',
            url: 'https://openapi.naver.com/v1/map/reversegeocode',
            qs: {
                query: +body.latitude+','+body.longitude
            },
            headers: {
                'Postman-Token': '96178603-5dc3-4a62-a95c-d0f300e832ec',
                'Cache-Control': 'no-cache',
                'X-Naver-Client-Secret': 'OhHyeTOSu4',
                'X-Naver-Client-Id': 'VMck1W78sWD0YXjwOV1z'
            }
        };

        request(options, function (error, response, reqdata) {
            if (error) throw new Error(error);
            json = JSON.parse(reqdata)
            console.log(json)
            console.log(body)
            console.log(JSON.stringify(json.result.items[0].address));

            db.User.findOne({
                id : body.id
            }, (err, data)=>{
                if(err) throw err
                else if(data){
                    tmpname = data.username
                    console.log('user'+data)
                    db.User.findOne({
                        usertoken : data.guardiantoken
                    }, (err, dataa)=>{
                        if(err) throw err
                        else if(data){
                            console.log("mom"+dataa)
                            var danger_save = new db.Danger({
                                latitude : body.latitude,
                                longitude : body.longitude,
                                time : moment().format('YYYY년 MM월 DD일\nA h시mm분ss초'),
                                address : json.result.items[0].address,
                                id : dataa.id
                            })
                            danger_save.save((err)=>{
                                if(err) throw err
                                else{
                                    var push_data = {
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        registration_ids: [dataa.fcmtoken],
                                        priority: "high",
                                        restricted_package_name: "rankhep.com.notthatway",
                                        data: {"title" : tmpname+"이(가) 위험지역에 접근했습니다!" , "text" : tmpname+"이(가) 위험지역에 접근했습니다!\n주소지 : "+json.result.items[0].address}
                                    }
                                    console.log(push_data)
                                    fcm.send(push_data, (err, responses) => {
                                        if (err) {
                                            console.log('fcm push Error => ' + err)
                                            //res.send(500, {success:false, message:"알림발송을 실패했습니다."})
                                        }
                                        else {
                                            console.log('FCM 발송완료')
                                            console.log(responses)
                                            res.send(200, {success:true, message:"알림 발송을 마쳤습니다"})
                                        }
                                    })
                                }
                            })

                        }
                    })
                }
            })
        });
    })

    app.post('/danger/list', (req, res)=>{
        var body = req.body
        db.User.findOne({
            id : body.id
        }, (err, data)=>{
            if(err) throw err
            else if(data){
                db.User.findOne({
                    guardiantoken:data.guardiantoken,
                }, (err, data)=>{
                    if(err) throw err
                    else if(data){
                        db.Danger.find({
                            id : data.id
                        }, (err, data)=>{
                            if(err) throw err
                            else if(data[0]){
                                res.send(200, data)
                            }
                            else{
                                res.send(200, [])
                            }
                        })
                    }
                    else{
                        res.send(200, [])
                    }
                })
            }
            else {
                res.send(200, [])
            }
        })
    })

    app.post('/test', (req, res)=>{
        var body = req.body;
        var push_data = {
            headers: {
                'Content-Type': 'application/json',
            },
            registration_ids: [body.fcmtoken],
            priority: "high",
            restricted_package_name: "rankhep.com.notthatway",
            data: {"title" : "위험지역에접근했습니다", "text" :"이위험지역에접근했습니다"}
        }

        console.log(push_data)
        fcm.send(push_data, (err, responses) => {
            if (err) {
                console.log('fcm push Error => ' + err)
                res.status(500).send({success:false, message:"알림발송을 실패했습니다."})
            }
            else {
                console.log('FCM 발송완료')
                console.log(responses)
                res.status(200).send({success:true, message:"알림 발송을 마쳤습니다"})
            }
        })
    })

}