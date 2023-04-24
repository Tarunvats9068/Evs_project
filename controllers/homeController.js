const Users = require('../models/user');
const Otp = require('../models/otp');
const nodemailer = require('nodemailer');
var transport = nodemailer.createTransport(
     {
     host: "smtp.gmail.com",
     port: 465,
     secure: true,
     service : 'Gmail',
     auth: {
         user:'csework133@gmail.com',
          pass:'gehngayhthsytysv'
   }
         
     }
   )
module.exports.home = function(req,res){
     return  res.render('index');
}
module.exports.create = async function (req, res) {
     if (req.body.password != req.body.con_pass) {
         return res.redirect('/sign_up');
     }
    let user = await Users.findOne({email:req.body.email});
//     console.log(user);
     if(!user)
     {
     user = await Users.create(req.body);
     if(!user) {
       console.log('error in creating user');
     }
     else 
     {
          const otp = Math.floor((Math.random()*1000000)+1);
          var mailOptions = {
            from:'csework133@gmail.com',
            to:req.body.email,
            subject:'One Time Password For Registration',
            html:'<h1> hello'+req.body.name+'</h1>'+'<h1>this  is your one time password do not tell it to anybody'+otp+'</h1>' + '<h1 style="color:red"></h1>'
          }
          transport.sendMail(mailOptions,function(err,info){
            if(err)
            {
                console.log('error in sending the mail');
                res.redirect('/sign_up');
                return;
            };
            console.log('mail is sent');
          });
          // console.log(user);
           Otp.create({
             user:user.id,
             otp:otp});
          return res.render('otp_verify');
     }
     }
     else{
         return res.redirect('/sign_up');
     }

 };
 module.exports.sign_up = function(req,res)
 {   
     return res.render('user_sigin');
 }
 module.exports.login = function(req,res)
 {
     return res.render('user_login');
 }
 module.exports.otp_verify = async function(req,res)
 {
     let otp = await Otp.findOne({otp:req.body.otp});
     console.log(otp);
     if(!otp)
     {
          return redirect('back');
     }
     else{
          let user_id = otp.user;
          let user = await Users.findByIdAndUpdate(user_id,{verify:true});
          if(!user)
          {
            console.log("otp is not match with the user");
            return redirect('/sign_up');
          }
          await Otp.findByIdAndDelete(otp.id);
          return res.redirect('/login'); 
     }
     
 }
 module.exports.forgot = async function(req,res)
 {
      return res.render('forgot_password');
 }
 module.exports.forgot_password = async function(req,res)
 {     let email = req.body.email;
       let user = await Users.findOne({email:email});
       if(!user)
       {
          console.log("email id does'not exist");
          return redirect('/sign_up');
       }
     var mailOptions = {
    from:'csework133@gmail.com',
    to:req.body.email,
    subject:'reset password link',
    html:'<h1> hello '+ user.name+'</h1>'+'<h1> your password reset link is here  '+  `http://localhost:9000/set_password/?${user.id}`  +'</h1>' + '<h1 style="color:red"></h1>'
  }
  transport.sendMail(mailOptions,function(err,info){
    if(err)
    {
        console.log('error in sending the mail');
        return res.redirect('/sign_up');
        
    };
    console.log('mail is sent');
    return res.redirect('/login');
 }
  )
}

module.exports.setpassword = async function(req,res)
{

      return res.render('set_password');
      
}
module.exports.update_password = async function(req,res)
{
  let user_id = req.query.u_id;
  let user = await Users.findByIdAndUpdate(user_id,{password:req.query.ps});
  if(!user)
  {
    console.log("user does not exist ");
    return res.redirect('/sign_up');
  }
  var mailOptions = {
    from:'csework133@gmail.com',
    to:user.email,
    subject:'password Updated',
    html:'<h1> hello '+ user.name+'</h1>'+'<h1> your password is updated susscessfully thanks for visiting us. </h1>' + '<h1 style="color:red"></h1>'
  }
  transport.sendMail(mailOptions,function(err,info){
    if(err)
    {
        console.log('error in sending the mail');
        return res.redirect('/sign_up');
        
    };
    console.log('mail is sent');
    return res.redirect('/login');
 });
  // return ;
}


