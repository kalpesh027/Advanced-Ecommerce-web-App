import mongoose from "mongoose";

const advertisementsSectionTitleSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true,
      enum: ['Section 0','Section 1', 'Section 2', 'Section 3', 'Section 4'] 
    },
  }, 
  { timestamps: true });

const AdvertisementsSectionTitle = mongoose.model("advertisementsSectionTitle", advertisementsSectionTitleSchema);

export default AdvertisementsSectionTitle;
