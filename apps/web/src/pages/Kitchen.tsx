import { useEffect, useState } from "react";
import api from "../services/api";

interface Product {
    id: number;
    name: string;
    price: number;
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: Product;
}

interface DiningTable {
    id: number;
    number: number;
    status: string;
}

interface Account {
    id: number;
    tableId: number;
    status: string;
    table: DiningTable;
}

interface KitchenOrder {
    id: number;
    accountId: number;
    userId: number;
    status:"SENT_TO_KITCHEN"| "PREPARING"| "READY";
    note: string | null;
    createdAt: string;
    account: Account;
    items: OrderItem[];
}

export default function Kitchen() {

    const [orders, setOrders] = useState<KitchenOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);


    // =========================
    // CARGAR PEDIDOS DE COCINA
    // =========================

    useEffect(() => {

        const loadKitchenOrders = async () => {

            try {

                const response = await api.get("/kitchen");

                setOrders(response.data);

            } catch (error) {

                console.error(
                    "Error cargando pedidos de cocina:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        void loadKitchenOrders();

    }, []);


    // =========================
    // CAMBIAR ESTADO
    // =========================

const changeStatus = async (
    orderId: number,
    status: "PREPARING" | "READY"
) => {

    try {

        setUpdatingId(orderId);


        // Cambiar estado en el backend
        await api.patch(
            `/kitchen/${orderId}/status`,
            {
                status
            }
        );


        // Volver a consultar la cocina
        // para obtener la comanda completa
        const response = await api.get("/kitchen");


        setOrders(response.data);


    } catch (error) {

        console.error(
            "Error actualizando estado:",
            error
        );

        alert(
            "No se pudo actualizar el estado del pedido."
        );

    } finally {

        setUpdatingId(null);

    }

};


    // =========================
    // FORMATEAR HORA
    // =========================

    const formatTime = (date: string) => {

        return new Date(date).toLocaleTimeString(
            "es-PE",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =========================
    // CARGANDO
    // =========================

    if (loading) {

        return (

            <div className="p-6">

                <h1 className="text-2xl font-bold">
                    Cocina
                </h1>

                <p className="mt-2 text-gray-500">
                    Cargando pedidos...
                </p>

            </div>

        );

    }


    // =========================
    // INTERFAZ
    // =========================

    return (

        <div className="space-y-6">


            {/* ENCABEZADO */}

            <div>

                <p className="text-sm text-gray-500">
                    Gestión de comandas
                </p>

                <h1 className="text-3xl font-bold">
                    Cocina
                </h1>

                <p className="text-gray-500 mt-1">
                    Pedidos pendientes de preparación
                </p>

            </div>


            {/* SIN PEDIDOS */}

            {orders.length === 0 ? (

                <div className="bg-white rounded-xl shadow p-10 text-center">

                    <div className="text-5xl mb-4">
                        🍽️
                    </div>

                    <h2 className="text-xl font-bold">
                        No hay pedidos
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Las nuevas comandas aparecerán aquí.
                    </p>

                </div>

            ) : (


                /* PEDIDOS */

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">


                    {orders.map(order => (

                        <div
                            key={order.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >


                            {/* CABECERA */}

                            <div className="p-5 border-b">

                                <div className="flex justify-between items-start">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Comanda #{order.id}
                                        </p>

                                        <h2 className="text-2xl font-bold">
                                            Mesa{" "}
                                            {order.account?.table?.number}
                                        </h2>

                                    </div>


                                    <span
                                        className={`
                                            px-3 py-1
                                            rounded-full
                                            text-sm
                                            font-bold
                                            ${
                                                order.status === "SENT_TO_KITCHEN"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : order.status === "PREPARING"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-green-100 text-green-700"
                                            }
                                        `}
                                    >

                                        {order.status === "SENT_TO_KITCHEN"
                                            ? "Pendiente"
                                            : order.status === "PREPARING"
                                                ? "En preparación"
                                                : "Lista"
                                        }

                                    </span>

                                </div>


                                <p className="text-sm text-gray-500 mt-2">

                                    🕐 {formatTime(order.createdAt)}

                                </p>

                            </div>


                            {/* PRODUCTOS */}

                            <div className="p-5 space-y-3">

                                {order.items.map(item => (

                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center"
                                    >

                                        <div className="flex items-center gap-3">

                                            <span className="bg-gray-100 w-9 h-9 rounded-lg flex items-center justify-center font-bold">

                                                {item.quantity}

                                            </span>

                                            <span className="font-semibold">

                                                {item.product.name}

                                            </span>

                                        </div>


                                        <span className="text-gray-500">

                                            S/{" "}
                                            {(
                                                Number(item.price) *
                                                item.quantity
                                            ).toFixed(2)}

                                        </span>

                                    </div>

                                ))}


                                {/* NOTA */}

                                {order.note && (

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">

                                        <p className="text-sm font-semibold">
                                            Nota:
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            {order.note}
                                        </p>

                                    </div>

                                )}

                            </div>


                            {/* ACCIONES */}

                            <div className="p-5 border-t">


                                {order.status === "SENT_TO_KITCHEN" && (

                                    <button

                                        onClick={() =>
                                            changeStatus(
                                                order.id,
                                                "PREPARING"
                                            )
                                        }

                                        disabled={
                                            updatingId === order.id
                                        }

                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold disabled:opacity-50"

                                    >
                                        

                                        {updatingId === order.id
                                            ? "Actualizando..."
                                            : "👨‍🍳 Empezar preparación"
                                        }

                                    </button>

                                )}


                                {order.status === "PREPARING" && (

                                    <button

                                        onClick={() =>
                                            changeStatus(
                                                order.id,
                                                "READY"
                                            )
                                        }

                                        disabled={
                                            updatingId === order.id
                                        }

                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold disabled:opacity-50"

                                    >

                                        {updatingId === order.id
                                            ? "Actualizando..."
                                            : "✓ Pedido listo"
                                        }

                                    </button>

                                )}


                                {order.status === "READY" && (

                                    <div className="w-full bg-green-50 text-green-700 py-3 rounded-lg text-center font-bold">

                                        ✓ Pedido listo para entregar

                                    </div>

                                )}

                            </div>


                        </div>

                    ))}


                </div>

            )}

        </div>

    );

}