import { model, Schema } from "mongoose";

const TimeSchema = new Schema(
    {
        date: {
            type: Date, // Changed to Date type
            required: true
        },
        time_date: [{
            start: {
                type: String,

            },
            end: {
                type: String,

            }
        }
        ]
    },
    { timestamps: true }
);


 const Time = model('Timemodel', TimeSchema);
 export default Time
