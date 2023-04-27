const Users = require('../models/user');
const Otp = require('../models/otp');
const nodemailer = require('nodemailer');
const validator = require('email-validator');
 

var transport = nodemailer.createTransport(
     {
     host: "smtp.gmail.com",
     port: 465,
     secure: true,
     service : 'Gmail',
     auth: {
         user:'mr.coder0092@gmail.com',
          pass:'innvplievadzytvj'
   }
         
     }
   )
module.exports.home = function(req,res){
     return  res.render('index');
}
module.exports.create = async function (req, res) {
     if (req.body.password != req.body.con_pass) {
         req.flash('error','password does not match');
         return res.redirect('/sign_up');
     }
    let user = await Users.findOne({email:req.body.email});
//     console.log(user);
     if(!user)
     {
      if(!validator.validate(req.body.email))
      {
        req.flash('error','email id does not exist');
        return res.redirect('/sign_up');
      }
     else 
     {
          const otp = Math.floor((Math.random()*1000000)+1);
          var mailOptions = {
            from:'mr.coder0092@gmail.com',
            to:req.body.email,
            subject:'One Time Password For Registration',
            html:'<p> Dear, <b>'+req.body.name+' </b></p>'+'<p> this  is your one time password do not tell it to anybody <b>'+otp+'</b></p>'
          }
          transport.sendMail(mailOptions,async function(err,info){
            if(err)
            {
                console.log('error in sending the mail');
                req.flash('error','mail id does not exist');
                return res.redirect('/sign_up');
                
            };
          });
            // console.log('mail is sent');
            user = await Users.create(req.body);
            if(!user) {
              console.log('error in creating user');
              return res.redirect('/signup');
            }
           Otp.create({
             user:user.id,
             otp:otp});
             req.flash('success','mail sent to your register id');
             return res.redirect('/otp');
     }
     }
     else{
        req.flash('error','email id is already registered');
        return res.redirect('/sign_up');
     }

 };
 module.exports.otp = function(req,res)
 {   
     return res.render('otp_verify');
 }
 module.exports.sign_up = function(req,res)
 {   
     return res.render('user_login');
 }
 module.exports.login = function(req,res)
 {   
     return res.render('user_login');
 }
 module.exports.otp_verify = async function(req,res)
 {
     let otp = await Otp.findOne({otp:req.body.otp});
    //  console.log(otp);
     if(!otp)
     {    
          req.flash('error','otp does match')
          return res.redirect('otp');
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
          req.flash('error','mail id does not registered');
          return res.redirect('/sign_up');
       }
       else if(!user.verify)
       {
        const otp = Math.floor((Math.random()*1000000)+1);
        var mailOptions = {
          from:'mr.coder0092@gmail.com',
          to:email,
          subject:'One Time Password For Registration',
          html:'<p> Dear, <b>'+req.body.name+' </b></p>'+'<p> this  is your one time password do not tell it to anybody <b>'+otp+'</b></p>'
        }
        transport.sendMail(mailOptions,async function(err,info){
          if(err)
          {
              console.log('error in sending the mail');
              req.flash('error','mail id does not exist');
              return res.redirect('/sign_up');
              
          };
        });
         Otp.create({
           user:user.id,
           otp:otp});
           req.flash('success','mail sent to your register id');
           return res.redirect('/otp');
       }
     var mailOptions = {
    from:'mr.coder0092@gmail.com',
    to:email,
    subject:'Password reset link',
    html:'<p> Dear, <b>'+user.name+' </b></p>'+'<b> your password reset link is here  '+  `http://10.0.0.128:9000/set_password/?${user.id}`
  }
  transport.sendMail(mailOptions,function(err,info){
    if(err)
    {
        console.log('error in sending the mail');
        req.flash('error','mail id does not registered');
        return res.redirect('/sign_up');
        
    };
    req.flash('success','mail sent to your registered id');
    // console.log('mail is sent');
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
    req.flash('error','mail id not registered');
    console.log("user does not exist ");
    return res.redirect('/sign_up');
  }
  var mailOptions = {
    from:'mr.coder0092@gmail.com',
    to:user.email,
    subject:'Password Updated',
    html:'<p> Dear, <b>'+ user.name+' </b>  your password is updated successfully thanks for visiting us. </p>' + '<h1 style="color:red"></h1>'
  }
  transport.sendMail(mailOptions,function(err,info){
    if(err)
    {
        console.log('error in sending the mail');
        return res.redirect('/sign_up');
        
    };
    // console.log('mail is sent');
    req.flash('success','your password is successfully updated');
    return res.redirect('/login');
 });
  // return ;
}
module.exports.login_form = async function(req,res)
{
      req.flash('success','Welcome 🙏🙏');
      return res.redirect('/');   
}
module.exports.form_contact = async function(req,res)
{
  var mailOptions = {
    from:'mr.coder0092@gmail.com',
    to:'tarun989629@gmail.com',
    subject:req.body.subject,
    html:'<p>'+ req.body.message +'<br> User Name '+ req.body.name +' <br> <p> User Email '+ req.body.email
  }
  transport.sendMail(mailOptions,function(err,info){
    if(err)
    {
        console.log('error in sending the mail');
        req.flash('error','mail not sent');
        return res.redirect('/');
        
    };
    // console.log('mail is sent');
    req.flash('success','your query sent');
    return res.redirect('/');
 });        
}

module.exports.signout = function(req,res,next){
   req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success','logout successfully 👋');
   return res.redirect('/login');
  });
}
module.exports.login = function(req,res)
{   
    return res.render('user_login');
}
module.exports.scrap_metal = function(req,res)
{   
    return res.render('Scrap_metal');
}
module.exports.plastic_waste = function(req,res)
{   
    return res.render('Plastic_Waste');
}
module.exports.paper_waste = function(req,res)
{   
    return res.render('Paper_waste');
}
module.exports.organic_waste = function(req,res)
{   
    return res.render('Organic_Waste');
}
module.exports.chemical_waste = function(req,res)
{   
    return res.render('Chemical_Waste');
}
