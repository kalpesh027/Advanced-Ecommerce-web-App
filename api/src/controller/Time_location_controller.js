import Timelocation from "../models/Time_location.model.js";

//http://localhost:5454/api/timelocation/createaddress

// {
//     "address":"sant mala",
//     "pincode":413701,
//     "city":"shrigonda",
//     "date":"28/9/2024",
//     "start":"2:00", 
//     "end":"3:00",
//     "landMark":"pachpute",
//     "street":"nagar-daund",
//     "mobile":987654
// }

const Addtimelocation = async (req, res) => {
    try {
        // console.log("TL user-", req.user)
        // const user_id = req.user.id;
        // if (!user_id) {
        //     console.log("user id not availabel", user_id)
        // }


        const { address, city, pincode, day, start, end, landMark, street, mobile,area,district,state,houseNumber } = req.body

        const VALID_PINCODE = 413701;
        const VALID_CITY = 'Shrigonda';

        // if (pincode !== VALID_PINCODE || city.toLowerCase() !== VALID_CITY.toLowerCase()) {
        //     return res.status(400).send('Address must be in Shrigonda, pin code 413701.')
        // }
        // if (!date || !start || !end) {
        //     return res.status(400).send('Date and time are required.');
        // }

        const Addressdata = await Timelocation.create({
            // mobile
            address,area,district,state,houseNumber,
            city, pincode, landMark, street,day,start,end
        })
        res.json({
            Addressdata,
            msg: "address updated sucessfully !!"
        })
    }
    catch (e) {
        console.log(e)
    }
}

//http://localhost:5454/api/timelocation/update
export const updateTimelocation = async (req,res)=>{

    try{
        const {id, address, city, pincode, date, start, end, landMark, street, mobile,area,district,state,houseNumber} = req.body
        
        const update = await Timelocation.updateOne({_id:id},{
            $set:{
                address,area,district,state,houseNumber,
                city, pincode, landMark, street,
                "time.date":date,
                "time.start": start,
                "time.end": end,
            }
        })
        res.json({
            success: true,
            data: update,
            msg: `address updated sucessfully !!`
        })

    }
    catch(e){
        console.log(e)
    }
}

//http://localhost:5454/api/timelocation/addressbyid
export const gettimelocationbyId = async (req, res) => {
    try {
        // const user_id = req.user.id;
        // if (!user_id) {
        //     console.log("user id not availabel", user_id)
        // }

        const { id } = req.body
        console.log(id)

        // const address = await Timelocation.findOne({user_id:user_id})
        const address = await Timelocation.findById(id)

        if (!address) {
            res.status(400).json("cann't get data")
        }

        res.json({
            address,
            msg: "address added"
        })
    }
    catch (e) {
        console.log(e)
    }
}

// http://localhost:5454/api/timelocation/delete/66f83d9bca49cae09cd597ce
export const DeleteTimelocation = async (req, res) => {
    try {
        const { id } = req.params;
        const DeleteData = await Timelocation.deleteOne({ _id: id })
        res.json({
            data: DeleteData,
            msg: "address deleted sucessfully !!"
        });
    }
    catch (error) {
        console.log(error)
    }
}


//http://localhost:5454/api/timelocation/alldata
export const AlldataTimelocation = async (req,res)=>{
    const alldata = await Timelocation.find()
    res.json({
        success: true,
        msg: "all fabric",
        data: alldata
    })
}


export const Check_address = async (req,res)=>{
    const {city,pincode} =  req.body;

      // Validate input
      if (!city || !pincode) {
        return res.status(400).json({ status: false, message: "Both city and pincode are required." });
    }

    try{
      const location = await  Timelocation.findOne({city,pincode})

      if(location){
        res.json({status:true, message:"address is deliverable"})
      }else{
        res.status(400).json({status:false, message:"address is not deliverable"})
      }

    }
    catch(e){
        console.error(e);
        res.status(500).json({ status: false, message: "Internal server error" })
    }
}

export const set_Location = async (req, res) => {
    const { city, pincode, area } = req.query; // Use req.query for GET requests

    const query = {};
    if (city) query.city = city;
    if (pincode) query.pincode = pincode;
    if (area) query.area = area;

    try {
        const locations = await Timelocation.find(query).exec();

        if (locations.length > 0) {
            res.json({ status: true, locations });
        } else {
            res.status(400).json({ status: false, message: "No deliverable addresses found" });
        }
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
};






export default Addtimelocation
