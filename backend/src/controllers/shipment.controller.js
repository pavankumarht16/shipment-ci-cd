import {
    getAllShipments,
    getShipmentById,
    createShipment,
    updateShipment,
    deleteShipment
} from "../modules/shipment.module.js";

export const getShipments = async (req, res) => {
    try {
        const shipments = await getAllShipments();

        res.status(200).json({
            success: true,
            count: shipments.length,
            data: shipments
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch shipments"
        });
    }
};


export const getShipment = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid shipment ID"
            });
        }

        const shipment = await getShipmentById(id);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        res.status(200).json({
            success: true,
            data: shipment
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch shipment"
        });
    }
};


export const createNewShipment = async (req, res) => {
    try {
        const {
            shipmentId,
            status,
            origin,
            destination
        } = req.body;

        if (
            !shipmentId ||
            !status ||
            !origin ||
            !destination
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "shipmentId, status, origin and destination are required"
            });
        }

        const shipment = await createShipment({
            shipmentId,
            status,
            origin,
            destination
        });

        res.status(201).json({
            success: true,
            message: "Shipment created successfully",
            data: shipment
        });
    } catch (error) {
        console.error(error);

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Shipment ID already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create shipment"
        });
    }
};


export const updateExistingShipment = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid shipment ID"
            });
        }

        const shipment = await updateShipment(
            id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Shipment updated successfully",
            data: shipment
        });
    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update shipment"
        });
    }
};


export const removeShipment = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid shipment ID"
            });
        }

        await deleteShipment(id);

        res.status(200).json({
            success: true,
            message: "Shipment deleted successfully"
        });
    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to delete shipment"
        });
    }
};