//models
const location =require('../../models/location')

module.exports=async(req,res)=>{
    location.find({}, (error,data) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send(data);
        }
  
});
}