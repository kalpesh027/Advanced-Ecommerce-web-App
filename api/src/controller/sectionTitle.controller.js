import AdvertisementsSectionTitle from "../models/advertisements_section_title.model.js";

export const createSectionTitle = async (req, res) => {
    const { title, section } = req.body;

    if (!title || !section) {
        return res.status(400).send({ message: "Title and section are required", status: false });
    }

    try {
        const newSectionTitle = new AdvertisementsSectionTitle({ title, section });
        const savedSectionTitle = await newSectionTitle.save();

        return res.status(201).send({ message: "Section title created successfully", status: true, data: savedSectionTitle });
    } catch (error) {
        console.error('Error creating section title:', error);
        return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
    }
};

export const getAllSectionTitles = async (req, res) => {
    try {
      const sectionTitles = await AdvertisementsSectionTitle.find();
  
      return res.status(200).send({ message: "Section titles retrieved successfully", status: true, data: sectionTitles });
    } catch (error) {
      console.error('Error retrieving section titles:', error);
      return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
    }
};

export const updateSectionTitle = async (req, res) => {
    const { id } = req.params;
    const { title, section } = req.body;

    if (!title && !section) {
        return res.status(400).send({ message: "At least one field (title or section) is required to update", status: false });
    }

    try {
        const updateData = {};
        if (title) updateData.title = title;
        if (section) updateData.section = section;

        const updatedSectionTitle = await AdvertisementsSectionTitle.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
        );

        if (!updatedSectionTitle) {
        return res.status(404).send({ message: "Section title not found", status: false });
        }

        return res.status(200).send({ message: "Section title updated successfully", status: true, data: updatedSectionTitle });
    } catch (error) {
        console.error('Error updating section title:', error);
        return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
    }
};

export const deleteSectionTitle = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedSectionTitle = await AdvertisementsSectionTitle.findByIdAndDelete(id);
  
      if (!deletedSectionTitle) {
        return res.status(404).send({ message: "Section title not found", status: false });
      }
  
      return res.status(200).send({ message: "Section title deleted successfully", status: true, data: deletedSectionTitle });
    } catch (error) {
      console.error('Error deleting section title:', error);
      return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
    }
};