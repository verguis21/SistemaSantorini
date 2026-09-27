import { useNavigate } from "react-router-dom";


export default function Login(){


const navigate = useNavigate();



function handleLogin(){

    navigate("/dashboard");

}



return (

<div className="min-h-screen flex items-center justify-center bg-gray-100">


<div className="bg-white p-8 rounded-xl shadow w-96">


<h1 className="text-3xl font-bold text-center mb-6">
Santorini POS
</h1>


<input
className="border p-3 w-full mb-3 rounded"
placeholder="Usuario"
/>


<input
className="border p-3 w-full mb-5 rounded"
placeholder="Contraseña"
type="password"
/>


<button

onClick={handleLogin}

className="bg-red-600 text-white w-full p-3 rounded"

>

Ingresar

</button>


</div>


</div>

)

}