import express from "express";
import cors from "cors";

import shipmentRoutes from "./routes/shipment.routes.js";

const app = express();

app.use(cors());

app.use(express.json());


app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "UP",
        message: "Shipment API is running"
    });
});


app.use("/api/shipments", shipmentRoutes);


// Unknown route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});


export default app;