import express from "express";

import {
    getShipments,
    getShipment,
    createNewShipment,
    updateExistingShipment,
    removeShipment
} from "../controllers/shipment.controller.js";

const router = express.Router();

router.get("/", getShipments);

router.get("/:id", getShipment);

router.post("/", createNewShipment);

router.put("/:id", updateExistingShipment);

router.delete("/:id", removeShipment);

export default router;