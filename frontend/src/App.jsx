import { useEffect, useState } from "react";

import {
    getShipments,
    createShipment,
    updateShipment,
    deleteShipment
} from "./services/shipmentApi";

function App() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        shipmentId: "",
        status: "",
        origin: "",
        destination: ""
    });

    const fetchShipments = async () => {
    try {
        setLoading(true);
        setError("");

        const data = await getShipments();

        setShipments(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchShipments();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const resetForm = () => {
        setForm({
            shipmentId: "",
            status: "",
            origin: "",
            destination: ""
        });

        setEditingId(null);
    };

    const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        setError("");

        if (editingId) {
            await updateShipment(editingId, form);
        } else {
            await createShipment(form);
        }

        resetForm();
        await fetchShipments();
    } catch (err) {
        setError(err.message);
    }
};

    const handleEdit = (shipment) => {
        setEditingId(shipment.id);

        setForm({
            shipmentId: shipment.shipmentId,
            status: shipment.status,
            origin: shipment.origin,
            destination: shipment.destination
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this shipment?"
    );

    if (!confirmed) {
        return;
    }

    try {
        setError("");

        await deleteShipment(id);

        await fetchShipments();
    } catch (err) {
        setError(err.message);
    }
};

    return (
        <div className="container">
            <h1>Shipment Tracker</h1>

            <p>Manage and track your shipments</p>

            <section className="card">
                <h2>
                    {editingId
                        ? "Edit Shipment"
                        : "Create Shipment"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        name="shipmentId"
                        placeholder="Shipment ID"
                        value={form.shipmentId}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="status"
                        placeholder="Status"
                        value={form.status}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="origin"
                        placeholder="Origin"
                        value={form.origin}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="destination"
                        placeholder="Destination"
                        value={form.destination}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-actions">
                        <button type="submit">
                            {editingId
                                ? "Update Shipment"
                                : "Create Shipment"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {error && (
                <div className="error">
                    {error}
                </div>
            )}

            <section className="card">
                <h2>Shipments</h2>

                {loading ? (
                    <p>Loading shipments...</p>
                ) : shipments.length === 0 ? (
                    <p>No shipments found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Shipment ID</th>
                                <th>Status</th>
                                <th>Origin</th>
                                <th>Destination</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {shipments.map((shipment) => (
                                <tr key={shipment.id}>
                                    <td>{shipment.shipmentId}</td>
                                    <td>{shipment.status}</td>
                                    <td>{shipment.origin}</td>
                                    <td>{shipment.destination}</td>

                                    <td>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(shipment)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    shipment.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}

export default App;