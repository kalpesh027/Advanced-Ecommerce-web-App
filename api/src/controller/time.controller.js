import Time from "../models/time_model.js";

export const Createtime = async (req, res) => {
    const { date, time_date } = req.body;

    const time = await Time.create({
        date: date,
        time_date: time_date.map(data => ({
            start: data.start,
            end: data.end

        }))
    })
    res.json({
        status: true,
        data: time
    })

}

export const getalltime = async (req, res) => {
    try {
        const timeentries = await Time.find()
        res.json({
            status: true,
            data: timeentries
        })
    }
    catch (e) {
        res.json(e)
    }
}

export const UpdateTime = async (req, res) => {
    const { id } = req.params; // Assuming the ID is passed as a route parameter
    const { date, time_date } = req.body;

    try {
        // Find the record by ID
        const timeRecord = await Time.findById(id);

        if (!timeRecord) {
            return res.status(404).json({
                status: false,
                message: "Record not found"
            });
        }


        // Update the fields

        const update = await Time.updateOne({ _id: id },
          {  $set:{
            date: date,
            time_date: time_date.map(data => ({
                start: data.start,
                end: data.end
            }))
        }} )
        res.json({
            status: true,
            data: update
        });
    }
    catch (e) {
        console.log(e)
    }

}

export const deletetime = async(req,res)=>{
    try {
        const { id } = req.params;
        const DeleteData = await Time.deleteOne({ _id: id })
        res.json({
            data: DeleteData,
            msg: "deleted successfully"
        });
    }
    catch (error) {
        console.log(error)
    }
}


export const gettimebyId = async (req, res) => {
    try {

        const { id } = req.params
        console.log(id)
        const timedata = await Time.findById(id)

        if (!timedata) {
            res.status(400).json("cann't get data")
        }

        res.json({
            timedata,
            msg: "time fetched"
        })
    }
    catch (e) {
        console.log(e)
    }
}
