//utils folder is use for the error class,extra material ,wrapAsyc

module.exports =  (fn) => {
    return (req,res,next) => {
        fn(req ,res , next) .catch (next);
    }
}