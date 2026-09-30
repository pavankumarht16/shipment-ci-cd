import {
    describe,
    expect,
    it,
    vi,
    beforeEach
} from "vitest";

import {
    render,
    screen,
    fireEvent,
    waitFor
} from "@testing-library/react";

import App from "./App";

import {
    getShipments,
    createShipment,
    updateShipment,
    deleteShipment
} from "./services/shipmentApi";

vi.mock("./services/shipmentApi", () => ({
    getShipments: vi.fn(),
    createShipment: vi.fn(),
    updateShipment: vi.fn(),
    deleteShipment: vi.fn()
}));

const shipment = {
    id: 1,
    shipmentId: "TEST001",
    status: "In Transit",
    origin: "Bangalore",
    destination: "Mumbai"
};

const fillShipmentForm = () => {
    fireEvent.change(
        screen.getByPlaceholderText("Shipment ID"),
        {
            target: {
                value: "TEST002"
            }
        }
    );

    fireEvent.change(
        screen.getByPlaceholderText("Status"),
        {
            target: {
                value: "In Transit"
            }
        }
    );

    fireEvent.change(
        screen.getByPlaceholderText("Origin"),
        {
            target: {
                value: "Bangalore"
            }
        }
    );

    fireEvent.change(
        screen.getByPlaceholderText("Destination"),
        {
            target: {
                value: "Mumbai"
            }
        }
    );
};

describe("Shipment Tracker", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        getShipments.mockResolvedValue([]);

        createShipment.mockResolvedValue({
            success: true
        });

        updateShipment.mockResolvedValue({
            success: true
        });

        deleteShipment.mockResolvedValue({
            success: true
        });
    });

    it("renders the shipment tracker", async () => {
        render(<App />);

        expect(
            screen.getByText("Shipment Tracker")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create Shipment"
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText("Shipments")
        ).toBeInTheDocument();
    });

    it("loads and displays shipments", async () => {
        getShipments.mockResolvedValue([shipment]);

        render(<App />);

        expect(
            await screen.findByText("TEST001")
        ).toBeInTheDocument();

        expect(
            screen.getByText("In Transit")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Bangalore")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Mumbai")
        ).toBeInTheDocument();

        expect(getShipments).toHaveBeenCalled();
    });

    it("creates a shipment", async () => {
        render(<App />);

        fillShipmentForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Shipment"
            })
        );

        await waitFor(() => {
            expect(createShipment).toHaveBeenCalledWith({
                shipmentId: "TEST002",
                status: "In Transit",
                origin: "Bangalore",
                destination: "Mumbai"
            });
        });

        expect(getShipments).toHaveBeenCalled();
    });

    it("edits a shipment", async () => {
        getShipments.mockResolvedValue([shipment]);

        render(<App />);

        const editButton = await screen.findByRole(
            "button",
            {
                name: "Edit"
            }
        );

        fireEvent.click(editButton);

        const statusInput =
            screen.getByPlaceholderText("Status");

        fireEvent.change(statusInput, {
            target: {
                value: "Delivered"
            }
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Shipment"
            })
        );

        await waitFor(() => {
            expect(updateShipment).toHaveBeenCalledWith(
                1,
                {
                    shipmentId: "TEST001",
                    status: "Delivered",
                    origin: "Bangalore",
                    destination: "Mumbai"
                }
            );
        });

        expect(getShipments).toHaveBeenCalled();
    });

    it("deletes a shipment", async () => {
        getShipments.mockResolvedValue([shipment]);

        vi.spyOn(window, "confirm")
            .mockReturnValue(true);

        render(<App />);

        const deleteButton = await screen.findByRole(
            "button",
            {
                name: "Delete"
            }
        );

        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(deleteShipment).toHaveBeenCalledWith(1);
        });

        expect(getShipments).toHaveBeenCalled();

        window.confirm.mockRestore();
    });

    it("cancels shipment deletion", async () => {
        getShipments.mockResolvedValue([shipment]);

        vi.spyOn(window, "confirm")
            .mockReturnValue(false);

        render(<App />);

        const deleteButton = await screen.findByRole(
            "button",
            {
                name: "Delete"
            }
        );

        fireEvent.click(deleteButton);

        expect(deleteShipment).not.toHaveBeenCalled();

        window.confirm.mockRestore();
    });

    it("displays an error when creating a shipment fails", async () => {
        createShipment.mockRejectedValue(
            new Error("Failed to create shipment")
        );

        render(<App />);

        fillShipmentForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Shipment"
            })
        );

        expect(
            await screen.findByText(
                "Failed to create shipment"
            )
        ).toBeInTheDocument();
    });

    it("displays an error when loading shipments fails", async () => {
        getShipments.mockRejectedValue(
            new Error("Failed to fetch shipments")
        );

        render(<App />);

        expect(
            await screen.findByText(
                "Failed to fetch shipments"
            )
        ).toBeInTheDocument();
    });
});