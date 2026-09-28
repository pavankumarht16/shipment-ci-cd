import prisma from "../config/database.js";

export const getAllShipments = async () => {
    return prisma.shipment.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const getShipmentById = async (id) => {
    return prisma.shipment.findUnique({
        where: {
            id
        }
    });
};

export const createShipment = async (shipmentData) => {
    return prisma.shipment.create({
        data: shipmentData
    });
};

export const updateShipment = async (id, shipmentData) => {
    return prisma.shipment.update({
        where: {
            id
        },
        data: shipmentData
    });
};

export const deleteShipment = async (id) => {
    return prisma.shipment.delete({
        where: {
            id
        }
    });
};