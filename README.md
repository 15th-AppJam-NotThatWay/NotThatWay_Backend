# NotThatWay
* NotThatWay Backend Server

* 요청은 POST(FormUrlEncoded)로 처리하였습니다.

* 기본 URL은 [URL]:3000 입니다.

## Server Code
### 200

    Success Processing Request
    
### 400

    Bad Request

### 401

    Unauthorized (Login Error)
    
### 403

    Forbidden -> 권한 오류
    
### 404

    URL Not Founded
    
### 409

    Conflict -> 데이터 충돌 (회원가입시 아이디 중복 등)
   
### 500

    Server Error

    
## API DOCUMENT

### Auth 

#### /auth/login (로그인)
>Requiring Params

    id : ID
    password : PW
    
>Return Values
>>Success
    
    HTTP : 200, JSONObject
    
>>Not Founded

    HTTP : 401

#### /auth/register (회원가입)
>Requiring Params
    
    일반유저 가입시
    username, id, password, type(보호자 : true, 일반유저 : false)
    
    보호자 가입시
    username, id, password, type, guardiantoken(보호자 유저토큰)
    
>Return Values
>>Success
    
    HTTP : 200, {success:true, message:"회원가입을 성공했습니다."}
    
>>Already In Database
    
    HTTP : 409, {success:false, message:"이미 존재하는 유저 입니다"}
  
    
#### /auth/fcmupdate (보호자 fcm토큰 업데이트)
>Requiring Params

    id(보호자 아이디), fcmtoken(업데이트할 토큰)

>Return Values
>>Success

    HTTP : 200, {success:true, message:"FCM토큰이 정상적으로 업데이트 되었습니다."}
    
>>User Not Founded

    HTTP : 401, {success:false, message:"존재하지 않는 유저입니다."}
    
### Danger
#### /danger/push (보호자에게 보낼 알림)
>Requiring Params

    id(장애인id), latitude(ex:127.0636675), longitude(ex:37.4883571)
    
>Return Values
>>Success

    HTTP : 200, {success:true, message:"알림발송을 성공했습니다."}
    
>>PUSH Error

    HTTP : 500, {success:false, message:"알림발송을 실패했습니다."}
    
#### /danger/list (위험내역)
>Requiring Params

    id : 보호자id
    
>Return Values
>>Success

    HTTP : 200, JSONArray(Danger 테이블)
    
## Table
### User Table (유저 정보 테이블)

    username : {type : String},
    id : {type : String},
    password : {type : String},
    usertoken : {type : String},
    guardiantoken : {type : String},
    fcmtoken : {type : String},
    usertype : {type : Boolean}
    
### Danger Table (위험 알람 저장 테이블)

    latitude : {type : String},
    longitude : {type : String},
    time : {type : String},
    address : {type : String},
    id : {type : String}

    
 

    
  