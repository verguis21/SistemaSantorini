import { useEffect, useState } from "react";
import api from "../services/api";

interface Product {

    id:number;
    name:string;
    price:number;

}
export default function Products(){

    const [products,setProducts]=useState<Product[]>([]);

useEffect(()=>{

api.get("/products")
.then(res=>{

setProducts(res.data)

})

},[])

return (

<div>

<h1 className="text-3xl font-bold mb-6">
Productos
</h1>

<div className="grid grid-cols-3 gap-5">

{
products.map(product=>(

<div
key={product.id}
className="bg-white p-5 rounded-xl shadow"
>

<h2 className="font-bold text-xl">

{product.name}

</h2>


<p>

S/ {product.price}

</p>


</div>


))

}

</div>

</div>

)

}