const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    
const getShipments = async () => {
    const response = await fetch(`${API_URL}/shipments`);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to fetch shipments"
        );
    }

    return result.data || result;
};

const createShipment = async (shipment) => {
    const response = await fetch(`${API_URL}/shipments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(shipment)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to create shipment"
        );
    }

    return result;
};

const updateShipment = async (id, shipment) => {
    const response = await fetch(`${API_URL}/shipments/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(shipment)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to update shipment"
        );
    }

    return result;
};

const deleteShipment = async (id) => {
    const response = await fetch(`${API_URL}/shipments/${id}`, {
        method: "DELETE"
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to delete shipment"
        );
    }

    return result;
};

export {
    getShipments,
    createShipment,
    updateShipment,
    deleteShipment
};