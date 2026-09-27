import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";


type OrderItem = {
    id: number;
    quantity: number;
    price: number;
    product: {
        name: string;
    };
};


type Order = {
    id: number;
    status: string;
    items: OrderItem[];
};


type CheckoutData = {
    accountId: number;
    mesa: number;
    total: number;
    orders: Order[];
};

const getErrorMessage = (error: unknown): string => {

    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
    ) {

        const response = (
            error as {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            }
        ).response;

        if (response?.data?.message) {
            return response.data.message;
        }
    }

    return "Ocurrió un error inesperado.";
};

export default function Checkout() {

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();


    const accountId = Number(
        searchParams.get("accountId")
    );


    const [checkout, setCheckout] =
        useState<CheckoutData | null>(null);


    const [method, setMethod] =
        useState("");


    const [loading, setLoading] =
        useState(true);


    const [paying, setPaying] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState(false);


    useEffect(() => {

        const loadCheckout = async () => {

            try {

                if (!accountId) {

                    setError(
                        "No se recibió una cuenta válida."
                    );

                    return;

                }


                const response =
                    await api.get(
                        `/checkout/${accountId}`
                    );


                setCheckout(response.data);


            } catch (error: unknown) {

                console.error(
                    "Error cargando caja:",
                    error
                );

                setError(
                    getErrorMessage(error)
                );

            } finally {

                setLoading(false);

            }

        };


        loadCheckout();

    }, [accountId]);


    const handlePay = async () => {

        if (!method) {

            setError(
                "Selecciona un método de pago."
            );

            return;

        }


        if (!checkout) {

            return;

        }


        try {

            setPaying(true);

            setError("");


            await api.post(
                "/checkout/pay",
                {
                    accountId: checkout.accountId,
                    method
                }
            );


            setSuccess(true);


            setTimeout(() => {

                navigate("/salon");

            }, 1500);


            } catch (error: unknown) {

                console.error(
                    "Error realizando cobro:",
                    error
                );

                setError(
                    getErrorMessage(error)
                );

            } finally {

                setPaying(false);

            }
    };


    if (loading) {

        return (
            <div>
                <h1>Caja</h1>
                <p>Cargando cuenta...</p>
            </div>
        );

    }


    if (error && !checkout) {

        return (
            <div>

                <h1>Caja</h1>

                <p>{error}</p>

                <button
                    onClick={() => navigate("/salon")}
                >
                    Volver al salón
                </button>

            </div>
        );

    }


    if (!checkout) {

        return null;

    }


    return (

        <div>

            <h1>
                Caja
            </h1>


            {success && (

                <div>

                    <h2>
                        ✅ Pago realizado correctamente
                    </h2>

                    <p>
                        La cuenta fue cerrada y la mesa quedó disponible.
                    </p>

                </div>

            )}


            {!success && (

                <>

                    <div>

                        <h2>
                            Mesa {checkout.mesa}
                        </h2>

                        <p>
                            Cuenta #{checkout.accountId}
                        </p>

                    </div>


                    <div>

                        <h2>
                            Consumo
                        </h2>


                        {checkout.orders.map(order => (

                            <div key={order.id}>

                                <h3>
                                    Comanda #{order.id}
                                </h3>


                                {order.items.map(item => (

                                    <div key={item.id}>

                                        <span>
                                            {item.quantity} ×{" "}
                                            {item.product.name}
                                        </span>

                                        <span>
                                            {" "}
                                            S/{" "}
                                            {(
                                                Number(item.price) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        ))}


                        <h2>
                            Total: S/ {checkout.total.toFixed(2)}
                        </h2>

                    </div>


                    <div>

                        <h2>
                            Método de pago
                        </h2>


                        <button
                            type="button"
                            onClick={() =>
                                setMethod("EFECTIVO")
                            }
                        >
                            💵 Efectivo
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setMethod("TARJETA")
                            }
                        >
                            💳 Tarjeta
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setMethod("YAPE")
                            }
                        >
                            📱 Yape
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setMethod("PLIN")
                            }
                        >
                            📱 Plin
                        </button>


                        <p>
                            Método seleccionado:{" "}
                            <strong>
                                {method || "Ninguno"}
                            </strong>
                        </p>

                    </div>


                    {error && (

                        <p>
                            ❌ {error}
                        </p>

                    )}


                    <button
                        onClick={handlePay}
                        disabled={
                            paying ||
                            !method
                        }
                    >

                        {paying
                            ? "Procesando..."
                            : `Cobrar S/ ${checkout.total.toFixed(2)}`
                        }

                    </button>

                </>

            )}

        </div>

    );

}