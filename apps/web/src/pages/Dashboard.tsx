export default function Dashboard(){

return (

<div>

<h1 className="text-3xl font-bold">
Dashboard Santorini POS
</h1>


<div className="grid grid-cols-3 gap-5 mt-8">


<div className="bg-white p-6 rounded-xl shadow">
<h2 className="text-xl font-semibold">
Mesas
</h2>

<p className="text-gray-500">
40 mesas registradas
</p>

</div>


<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-semibold">
Pedidos
</h2>

<p className="text-gray-500">
Pedidos pendientes
</p>

</div>



<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-semibold">
Caja
</h2>

<p className="text-gray-500">
Turno cerrado
</p>

</div>


</div>


</div>

)

}