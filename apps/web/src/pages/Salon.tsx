import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TableCard from "../components/TableCard";

interface Table {
    id: number;
    number: number;
    status: string;
}

export default function Salon() {

    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [openingTable, setOpeningTable] = useState<number | null>(null);

    const navigate = useNavigate();


    useEffect(() => {

    const loadTables = async () => {

        try {

            const response = await api.get("/tables");

            setTables(response.data);

        } catch (error) {

            console.error(
                "Error cargando mesas:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    void loadTables();

}, []);


const handleTableClick = async (table: Table) => {

    try {

        // Si la mesa está ocupada,
        // buscamos su cuenta abierta y entramos a ella.
        if (table.status !== "FREE") {

            console.log("Mesa seleccionada:", table);


            const response = await api.get(
                `/accounts/table/${table.id}`
            );


            console.log(
                "Cuenta encontrada:",
                response.data
            );


            const account = response.data;


            navigate(
                `/pedidos?accountId=${account.id}&tableId=${table.id}`
            );


            return;
        }

        // Mesa libre → crear nueva cuenta
        setOpeningTable(table.id);

        const response = await api.post("/accounts", {
            tableId: table.id
        });

        const account = response.data;

        // Actualizar estado visual de la mesa
        setTables(currentTables =>
            currentTables.map(item =>
                item.id === table.id
                    ? { ...item, status: "OCCUPIED" }
                    : item
            )
        );

        // Ir a la pantalla de pedidos
        navigate(
            `/pedidos?accountId=${account.id}&tableId=${table.id}`
        );

    } catch (error) {

        console.error("Error gestionando mesa:", error);

        alert("No se pudo abrir o recuperar la cuenta.");

    } finally {

        setOpeningTable(null);

    }
};


    if (loading) {

        return (

            <div className="p-6">

                <h1 className="text-2xl font-bold">
                    Cargando salón...
                </h1>

            </div>

        );

    }


    return (

        <div>

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold">
                        Salón
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Selecciona una mesa para comenzar la atención
                    </p>

                </div>

            </div>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                {tables.map(table => (

                    <div
                        key={table.id}
                        className={
                            openingTable === table.id
                                ? "opacity-50 pointer-events-none"
                                : ""
                        }
                    >

                        <TableCard

                            number={table.number}

                            status={table.status}

                            onClick={() => handleTableClick(table)}

                        />

                    </div>

                ))}

            </div>

        </div>

    );

}