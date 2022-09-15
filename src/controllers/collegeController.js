// POST /functionup/colleges
// Create a college - a document for each member of the group

// The logo link will be provided to you by the mentors. This link is a s3 (Amazon's Simple Service) url. Try accessing the link to see if the link is public or not.

// Endpoint: BASE_URL/functionup/colleges





const collegeModel = require("../models/collegeModel")
const {isValid, isValidRequest, regixValidator, isValidLogoLink} = require('../validator/validation')






const createCollege = async function (req, res) {

    try {
        let data = req.body

        if (!isValidRequest(data)) {
            return res
                .status(400)
                .send({ status: false, message: "author data is required" });
        }
        //using desturcturing
        const { name, fullName, logoLink} = data;

        //data should not have more than 5keys as per outhorSchema (edge case)
        if (Object.keys(data).length > 4) {
            return res.
                  status(400).
                  send({ status: false, message: "Invalid data entry inside request body" })
        }
       
        let y = name.trim()
        if (!isValid(y) || !regixValidator(y)) {
            return res
                .status(400)
                .send({ status: false, message: " name is required or its should contain character" })
        }

        let x = fullName.trim()
        const isNameUnique = await collegeModel.find( {$or: [
            { name: name },
            { fullName: x }
        ]})
       
        if (isNameUnique.length >= 1) 
        {
          if(isNameUnique.length==1){
             if(isNameUnique[0].name==name){
                 return res
             .status(400)
             .send({ status: false, message: "Name already exist" })
              }
              if(isNameUnique[0].fullName==x){
                 return res
             .status(400)
             .send({ status: false, message: "Fullname already exist" })
              }

          }
          else{
              return res
             .status(400)
             .send({ status: false, message: "Both already exist" })
             }
          }
 
              
              
        if (!isValid(x) ||  !regixValidator(x) ) {
            return res
                .status(400)
                .send({ status: false, message: "fullname is invalid" })
        }

        

        if(!logoLink || !isValidLogoLink(logoLink)){

            return res.status(400).send({status:false, message:"Please give valid logo link"})
        }

    
        const newCollege = await collegeModel.create(data);
       let College = {name:newCollege.name,
        fullName:newCollege.fullName,
        logoLink:newCollege.logoLink,
        isDeleted:newCollege.isDeleted}
    
                                          
        return res
            .status(201)
            .send({ status: true, message: newCollege.name +" college created successfully", data: College });

    } catch (err) {
        res.status(500).send({ err: err.message })

    }
}

module.exports.createCollege = createCollege