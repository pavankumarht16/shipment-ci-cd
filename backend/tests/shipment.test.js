import dotenv from "dotenv";

dotenv.config({
    path: ".env.test",
    override: true
});

const { default: request } = await import("supertest");
const { default: app } = await import("../src/app.js");
const { default: prisma } = await import("../src/config/database.js");

import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll
} from "vitest";


describe("Shipment API", () => {

    let shipmentId;


    beforeAll(async () => {

        await prisma.shipment.deleteMany({
            where: {
                shipmentId: {
                    startsWith: "TEST-"
                }
            }
        });

    });


    afterAll(async () => {

        await prisma.shipment.deleteMany({
            where: {
                shipmentId: {
                    startsWith: "TEST-"
                }
            }
        });

        await prisma.$disconnect();

    });


    it("should return health status", async () => {

        const response = await request(app)
            .get("/api/health");

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.status).toBe("UP");

    });


    it("should return shipments", async () => {

        const response = await request(app)
            .get("/api/shipments");

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(Array.isArray(response.body.data))
            .toBe(true);

    });


    it("should create a shipment", async () => {

        const response = await request(app)
            .post("/api/shipments")
            .send({
                shipmentId: "TEST-001",
                status: "Requested",
                origin: "Bangalore",
                destination: "Mumbai"
            });

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.data.shipmentId)
            .toBe("TEST-001");

        shipmentId = response.body.data.id;

    });


    it("should get a shipment by ID", async () => {

        const response = await request(app)
            .get(`/api/shipments/${shipmentId}`);

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.id)
            .toBe(shipmentId);

    });


    it("should update a shipment", async () => {

        const response = await request(app)
            .put(`/api/shipments/${shipmentId}`)
            .send({
                status: "In Transit"
            });

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.status)
            .toBe("In Transit");

    });


    it("should reject incomplete shipment data", async () => {

        const response = await request(app)
            .post("/api/shipments")
            .send({
                shipmentId: "TEST-INVALID"
            });

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

    });


    it("should return 404 for a non-existing shipment", async () => {

        const response = await request(app)
            .get("/api/shipments/999999");

        expect(response.status).toBe(404);

        expect(response.body.success).toBe(false);

        expect(response.body.message)
            .toBe("Shipment not found");

    });


    it("should delete a shipment", async () => {

        const response = await request(app)
            .delete(`/api/shipments/${shipmentId}`);

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

    });

});