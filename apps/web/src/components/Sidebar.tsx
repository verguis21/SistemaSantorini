import {
Home,
Utensils,
Package,
ChefHat,
Wallet
} from "lucide-react";

import { Link } from "react-router-dom";


export default function Sidebar(){

return (

<div className="w-64 bg-white shadow-lg p-5">


<h1 className="text-2xl font-bold mb-8">
Santorini POS
</h1>


<nav className="space-y-4">


<Link to="/dashboard">
<Home/> Inicio
</Link>


<Link to="/salon">
<Utensils/> Salón
</Link>


<Link to="/productos">
<Package/> Productos
</Link>

<Link to="/cocina">
<ChefHat/> Cocina
</Link>


<Link to="/caja">
<Wallet/> Caja
</Link>


</nav>


</div>

)

}