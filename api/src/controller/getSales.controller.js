import TotalOnlineSales from "../models/total.online.sales.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getTotalOnlineSale = async (req, res) => {
    const { id } = req.user; // This can be used for filtering or authorization

    try {
        const cart = await TotalOnlineSales.find();

        if (!cart || cart.length === 0) {
            return res.status(404).json(new ApiResponse(404, 'sales not found', null));
        }

        return res.status(200).json(new ApiResponse(200, 'fetch sales successfully', cart));
    } catch (error) {
        console.error("Error fetching sales:", error);
        return res.status(500).json(new ApiResponse(500, 'Server error', null));
    }
};

export { getTotalOnlineSale };
