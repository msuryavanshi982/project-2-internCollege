const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel")
const { isValid, isValidRequest, regixValidator, mobileValidator, isValidEmail } = require('../validator/validation')


// POST /functionup/interns
// Create a document for an intern.

// Also save the collegeId along with the document. Your request body contains the following fields - { name, mobile, email, collegeName}

// Return HTTP status 201 on a succesful document creation. Also return the document. The response should be a JSON object like this

// Return HTTP status 400 for an invalid request with a response body like


const createIntern = async function (req, res) {

    try {
        let data = req.body

        if (!isValidRequest(data)) {
            return res
                .status(400)
                .send({ status: false, message: "author data is required" });
        }
        //using desturcturing
        const { name, email, mobile, collegeName } = data;

        //data should not have more than 5keys as per outhorSchema (edge case)
        if (Object.keys(data).length > 5) {
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


        if (!isValid(email)) {
            return res
                .status(400)
                .send({ status: false, message: "email is required" })
        }

        if (!isValidEmail(email)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter a valid email address" })
        }

        const isUnique = await internModel.find({
            $or: [
                { email: email },
                { mobile: mobile }
            ]
        })


        if (isUnique.length >= 1) 
           {
             if(isUnique.length==1){
                if(isUnique[0].email==email){
                    return res
                .status(400)
                .send({ status: false, message: "Email already exist" })
                 }
                 if(isUnique[0].mobile==mobile){
                    return res
                .status(400)
                .send({ status: false, message: "Mobile already exist" })
                 }

             }
             else{
                 return res
                .status(400)
                .send({ status: false, message: "Both already exist" })
                }
             }
    
       
    if (!isValid(mobile)) {
        return res
            .status(400)
            .send({ status: false, message: "Enter a valid email address" })
    }

    if (!mobileValidator(mobile)) {
        return res
            .status(400)
            .send({ status: false, message: "Enter a valid mobile number" })
    }



    let college = await collegeModel.findOne({ name: collegeName })

    let collegeId = college._id



    let obj = {
        ...data,
        collegeId: collegeId
    }

    const newIntern = await internModel.create(obj);
    return res
        .status(201)
        .send({ status: true, message: "intern created successfully", data: newIntern });

} catch (err) {
    console.log(err.message)
    res.status(500).send({ err: err.message })

}
}



//________________________________________________________get intern_______________________________________________
// GET /functionup/collegeDetails
// Returns the college details for the requested college (Expect a query parameter by the name collegeName. This is anabbreviated college name. For example iith)
// Returns the list of all interns who have applied for internship at this college.


const getIntern = async function (req, res) {

    try {

        let collegeName = req.query.name

        if (!collegeName) {

            return res.status(404).send({ status: false, message: "Please enter college name" })
        }

        //let {name, fullName, logoLink} = listOfInterns
      //  let requiredCollege = await collegeModel.findOne({ name: collegeName, isDeleted: false }, { name: 1, fullName: 1, logoLink: 1 })


        const requiredCollege = await internModel.find({
            $or: [
                { name: name },
                { fullName: fullName }
            ]
        })
         
        if (requiredCollege.length >= 1) 
        {
          if(requiredCollege.length==1){
             if(requiredCollege[0].name==name){
                 return res
             .status(400)
             .send({ status: false, message: "name already exist" })
              }
              if(requiredCollege[0].fullName==fullName){
                 return res
             .status(400)
             .send({ status: false, message: "fullname already exist" })
              }

          }
          else{
              return res
             .status(400)
             .send({ status: false, message: "Both already exist" })
             }
          }
 


        let collegeID = requiredCollege._id

        if(!collegeID){

            return res.status(404).send({ status: false, message: "there is no such college" })
        }

        if (!requiredCollege) {

            return res.status(404).send({ status: false, message: "Please enter valid college name" })
        }

        let list = await internModel.find({ collegeId: collegeID, isDeleted: false }, { name: 1, email: 1, mobile: 1 })
      if(list.length==0){

        var x = "No interns in this college exist"
      }
      else{
        var x = list
      }

        
        
        let obj = {
            name: requiredCollege.name,
            fullName: requiredCollege.fullName,
            logoLink: requiredCollege.logoLink,
            interns: x
        };
    





        //console.log(requiredList)

        return res.status(201).send({ status: true, message: "This is the intern list", data: obj });



    } catch (err) {
        res.status(500).send({ err: err.message })

    }
}


module.exports = { createIntern, getIntern }




















