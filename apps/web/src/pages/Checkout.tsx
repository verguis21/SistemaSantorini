
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

const PAYMENT_METHODS = [
    {
        id: "EFECTIVO",
        label: "Efectivo",
        icon: "💵",
        description: "Pago en efectivo",
    },
    {
        id: "TARJETA",
        label: "Tarjeta",
        icon: "💳",
        description: "Tarjeta de débito o crédito",
    },
    {
        id: "YAPE",
        label: "Yape",
        icon: "📱",
        description: "Pago con Yape",
    },
    {
        id: "PLIN",
        label: "Plin",
        icon: "📲",
        description: "Pago con Plin",
    },
] as const;

const formatMoney = (value: number) =>
    new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
    }).format(value);

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

    return "Ocurrió un error inesperado. Inténtalo nuevamente.";
};

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const accountId = Number(searchParams.get("accountId"));

    const [checkout, setCheckout] =
        useState<CheckoutData | null>(null);

    const [method, setMethod] = useState("");
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let active = true;

        const loadCheckout = async () => {
            setLoading(true);
            setError("");

            try {
                if (!Number.isInteger(accountId) || accountId <= 0) {
                    throw new Error("No se recibió una cuenta válida.");
                }

                const response = await api.get(
                    `/checkout/${accountId}`
                );

                if (active) {
                    setCheckout(response.data);
                }
            } catch (error: unknown) {
                console.error("Error cargando caja:", error);

                if (active) {
                    setError(getErrorMessage(error));
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadCheckout();

        return () => {
            active = false;
        };
    }, [accountId]);

    const handlePay = async () => {
        if (!method || !checkout || paying || success) {
            return;
        }

        setPaying(true);
        setError("");

        try {
            await api.post("/checkout/pay", {
                accountId: checkout.accountId,
                method,
            });

            setSuccess(true);

            window.setTimeout(() => {
                navigate("/salon");
            }, 1800);
        } catch (error: unknown) {
            console.error("Error realizando cobro:", error);
            setError(getErrorMessage(error));
        } finally {
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4">💳</div>
                    <h1 className="text-2xl font-bold text-white">
                        Preparando caja
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Cargando el detalle de la cuenta...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !checkout) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-6">
                <div className="bg-[#202027] border border-red-500/30 rounded-2xl p-8 text-center">
                    <div className="text-5xl mb-4">⚠️</div>

                    <h1 className="text-2xl font-bold text-white">
                        No se puede abrir la caja
                    </h1>

                    <p className="text-red-300 mt-4">{error}</p>

                    <button
                        onClick={() => navigate("/salon")}
                        className="mt-6 rounded-xl bg-[#e64b42] hover:bg-[#cf3d35] text-white font-bold px-6 py-3 transition"
                    >
                        Volver al salón
                    </button>
                </div>
            </div>
        );
    }

    if (!checkout) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-7 text-gray-100">
            {/* Encabezado */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-[#e89b91] font-semibold">
                        Santorini POS / Operaciones
                    </p>

                    <h1 className="text-4xl font-extrabold mt-2">
                        Caja
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Revisa el consumo y registra el pago de la cuenta.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/salon")}
                    disabled={paying || success}
                    className="rounded-xl border border-gray-600 px-5 py-3 text-gray-200 hover:bg-white/5 disabled:opacity-50 transition"
                >
                    ← Volver al salón
                </button>
            </header>

            {/* Confirmación */}
            {success && (
                <div
                    role="status"
                    className="rounded-2xl border border-green-500/40 bg-green-500/10 p-6"
                >
                    <h2 className="text-xl font-bold text-green-300">
                        ✓ ¡Pago realizado correctamente!
                    </h2>

                    <p className="text-gray-200 mt-2">
                        La venta quedó registrada. Volviendo al salón...
                    </p>
                </div>
            )}

            {!success && (
                <>
                    {/* Información de la cuenta */}
                    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-white/10 bg-[#202027] p-5">
                            <p className="text-sm text-gray-400">
                                Mesa
                            </p>

                            <p className="text-3xl font-extrabold mt-2">
                                #{checkout.mesa}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#202027] p-5">
                            <p className="text-sm text-gray-400">
                                Cuenta
                            </p>

                            <p className="text-3xl font-extrabold mt-2">
                                #{checkout.accountId}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#202027] p-5">
                            <p className="text-sm text-gray-400">
                                Comandas
                            </p>

                            <p className="text-3xl font-extrabold mt-2">
                                {checkout.orders.length}
                            </p>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
                        {/* Detalle del consumo */}
                        <section className="rounded-2xl border border-white/10 bg-[#202027] overflow-hidden">
                            <div className="p-5 border-b border-white/10">
                                <h2 className="text-xl font-bold">
                                    🧾 Detalle del consumo
                                </h2>

                                <p className="text-sm text-gray-400 mt-1">
                                    Productos incluidos en esta cuenta.
                                </p>
                            </div>

                            {checkout.orders.length === 0 ? (
                                <p className="p-6 text-gray-400">
                                    Esta cuenta no tiene comandas.
                                </p>
                            ) : (
                                <div className="p-5 space-y-6">
                                    {checkout.orders.map((order) => (
                                        <div key={order.id}>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-bold">
                                                    Comanda #{order.id}
                                                </h3>

                                                <span className="text-xs rounded-full bg-white/10 px-3 py-1 text-gray-300">
                                                    {order.items.length}{" "}
                                                    {order.items.length === 1
                                                        ? "producto"
                                                        : "productos"}
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center justify-between gap-4 border-b border-white/5 pb-3"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="font-medium">
                                                                {item.product.name}
                                                            </p>

                                                            <p className="text-sm text-gray-400 mt-1">
                                                                {item.quantity} ×{" "}
                                                                {formatMoney(
                                                                    Number(item.price)
                                                                )}
                                                            </p>
                                                        </div>

                                                        <p className="font-semibold whitespace-nowrap">
                                                            {formatMoney(
                                                                Number(item.price) *
                                                                item.quantity
                                                            )}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="border-t border-white/10 p-5 flex justify-between items-center gap-4">
                                <span className="text-gray-300 font-semibold">
                                    Total a cobrar
                                </span>

                                <span className="text-3xl font-extrabold text-[#f0a69a]">
                                    {formatMoney(Number(checkout.total))}
                                </span>
                            </div>
                        </section>

                        {/* Panel de pago */}
                        <section className="rounded-2xl border border-white/10 bg-[#202027] p-5">
                            <h2 className="text-xl font-bold">
                                💳 Método de pago
                            </h2>

                            <p className="text-sm text-gray-400 mt-1 mb-5">
                                Selecciona cómo pagará el cliente.
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                {PAYMENT_METHODS.map((payment) => {
                                    const selected = method === payment.id;

                                    return (
                                        <button
                                            key={payment.id}
                                            type="button"
                                            onClick={() =>
                                                setMethod(payment.id)
                                            }
                                            disabled={paying}
                                            aria-pressed={selected}
                                            className={`relative min-h-32 rounded-xl border p-4 text-left transition ${
                                                selected
                                                    ? "border-[#e87568] bg-[#e87568]/15 ring-1 ring-[#e87568]"
                                                    : "border-white/10 bg-[#17171d] hover:border-white/30"
                                            } disabled:opacity-50`}
                                        >
                                            <span className="text-3xl">
                                                {payment.icon}
                                            </span>

                                            <span className="block font-bold mt-3">
                                                {payment.label}
                                            </span>

                                            <span className="block text-xs text-gray-400 mt-1">
                                                {payment.description}
                                            </span>

                                            {selected && (
                                                <span className="absolute top-2 right-2 text-[#f0a69a]">
                                                    ✓
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-6 rounded-xl bg-[#17171d] border border-white/10 p-4">
                                <p className="text-sm text-gray-400">
                                    Resumen del pago
                                </p>

                                <p className="text-lg font-bold mt-2">
                                    {method
                                        ? PAYMENT_METHODS.find(
                                              (payment) =>
                                                  payment.id === method
                                          )?.label
                                        : "Selecciona un método"}
                                </p>

                                <p className="text-2xl font-extrabold mt-3">
                                    {formatMoney(Number(checkout.total))}
                                </p>
                            </div>

                            {error && (
                                <div
                                    role="alert"
                                    className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
                                >
                                    ⚠️ {error}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handlePay}
                                disabled={
                                    paying ||
                                    !method ||
                                    checkout.total <= 0 ||
                                    success
                                }
                                className="w-full mt-5 rounded-xl bg-[#e64b42] hover:bg-[#cf3d35] text-white font-extrabold text-lg py-4 transition disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {paying
                                    ? "⏳ Procesando pago..."
                                    : `✓ Cobrar ${formatMoney(
                                          Number(checkout.total)
                                      )}`}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">
                                Verifica el método y el importe antes de
                                confirmar.
                            </p>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}
