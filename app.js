const express = require ("express");

const app = express();

const bodyParser = require ("body-parser");

const request = require ("request");

const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
  var fname = req.body.fname;
  var lname = req.body.lname;
  var mail = req.body.mail;

  var data ={
    members: [
      {
        email_address: mail,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname
        }
      }
    ]
  };
  var jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/3f78b24d79";
  const options = {
    method: "POST",
    auth: "john:df1bf85d9659afac293ec5210cb765a7-us14"
  };
  const request = https.request(url, options, function (response){

    if(response.statusCode === 200){
      res.sendFile(__dirname +"/success.html");
    }
    else{
      res.sendFile(__dirname +"/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res){
  res.redirect("/");
})
app.listen(process.env.PORT || 3000, function(){
  console.log("listening to port 3000");
});

// apikey
// df1bf85d9659afac293ec5210cb765a7-us14
// audience id
// 3f78b24d79
