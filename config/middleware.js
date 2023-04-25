module.exports.setflash = function(req,res,next)
{ 
        res.locals.message = req.flash();
        next();
   
}