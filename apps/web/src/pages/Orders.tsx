import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";


interface Product {

    id:number;
    name:string;
    price:number;

}



interface CartItem {

    product:Product;

    quantity:number;

    notes:string;

}




export default function Orders(){


const [searchParams] = useSearchParams();

const navigate = useNavigate();



const accountIdParam = searchParams.get("accountId");

const tableIdParam = searchParams.get("tableId");



const accountId = accountIdParam
? Number(accountIdParam)
: null;



const tableId = tableIdParam
? Number(tableIdParam)
: null;




const [products,setProducts] = useState<Product[]>([]);

const [cart,setCart] = useState<CartItem[]>([]);

const [existingOrder,setExistingOrder] = useState<CartItem[]>([]);

const [loading,setLoading] = useState(true);

const [sending,setSending] = useState(false);





// =============================
// CARGAR PRODUCTOS
// =============================


useEffect(()=>{


const loadProducts = async()=>{


try{


const response = await api.get("/products");


setProducts(response.data);



}catch(error){


console.error(
"Error cargando productos",
error
);


}finally{


setLoading(false);


}


};



void loadProducts();



},[]);







// =============================
// CARGAR PEDIDO EXISTENTE
// =============================


useEffect(()=>{


const loadExistingOrder = async()=>{


if(!accountId) return;



try{


const response = await api.get(
`/accounts/${accountId}`
);



const orders =
response.data.orders ?? [];



const items = orders.flatMap(
(order: {
    items: {
        product: Product;
        quantity: number;
        notes?: string | null;
    }[];
}) =>

order.items.map(
(item) => ({

product: item.product,

quantity: item.quantity,

notes: item.notes || ""

})

)

);



setExistingOrder(items);



}catch(error){


console.error(
"Error cargando pedido existente",
error
);



}


};



void loadExistingOrder();



},[accountId]);

// =============================
// AGREGAR PRODUCTO
// =============================


const addProduct = (product:Product)=>{


setCart(current=>{


const exists =
current.find(
item=>item.product.id===product.id
);



if(exists){


return current.map(item=>

item.product.id===product.id

?

{

...item,

quantity:item.quantity+1

}

:

item

);


}



return [

...current,

{

product,

quantity:1,

notes:""

}

];


});


};







// =============================
// ELIMINAR PRODUCTO
// =============================


const removeProduct=(productId:number)=>{


setCart(current=>

current.filter(
item=>item.product.id!==productId
)

);


};







// =============================
// CAMBIAR CANTIDAD
// =============================


const changeQuantity=(

productId:number,

amount:number

)=>{


setCart(current=>

current

.map(item=>{


if(item.product.id!==productId)

return item;



return {

...item,

quantity:item.quantity+amount

};


})

.filter(
item=>item.quantity>0
)

);


};

// =============================
// TOTAL
// =============================


const total =

existingOrder.reduce(

(sum,item)=>

sum +

Number(item.product.price)

*

item.quantity

,

0

)

+

cart.reduce(

(sum,item)=>

sum +

Number(item.product.price)

*

item.quantity

,

0

);

// =============================
// ENVIAR COMANDA
// =============================


const sendOrder = async()=>{


if(!accountId){

alert(
"No se encontró la cuenta"
);

return;

}



if(cart.length===0){

alert(
"Agrega productos"
);

return;

}



try{


setSending(true);



const payload={


accountId,


userId:1,


items:cart.map(item=>({


productId:item.product.id,


quantity:item.quantity,


notes:item.notes || undefined


}))


};




const response = await api.post(

"/orders",

payload

);
/*await api.patch(
 `/orders/${response.data.id}/status`,
 {
   status:"SENT_TO_KITCHEN"
 }
);*/


console.log(
"Comanda creada:",
response.data
);



alert(
"Comanda enviada a cocina"
);



setCart([]);



//navigate("/salon");
alert("Pedido enviado a cocina");



}catch(error){


console.error(
"Error enviando comanda",
error
);



alert(
"No se pudo enviar la comanda"
);



}finally{


setSending(false);


}


};







if(loading){


return (

<div className="p-6 text-white">

Cargando productos...

</div>

);


}




if(!accountId || !tableId){


return (

<div className="
bg-gray-900
text-white
rounded-xl
p-8
">


<h1 className="
text-2xl
font-bold
text-red-500
">

No hay mesa seleccionada

</h1>


<p className="
text-gray-400
mt-2
">

Selecciona una mesa desde salón.

</p>


</div>

);
}


    return (

    <div className="
    min-h-screen
    bg-gray-950
    text-white
    space-y-6
    ">


    {/* CABECERA */}

    <div className="
    bg-gray-900
    border
    border-gray-800
    rounded-2xl
    p-6
    flex
    justify-between
    items-center
    ">


    <div>

    <p className="
    text-gray-400
    text-sm
    ">

    Santorini POS

    </p>


    <h1 className="
    text-3xl
    font-bold
    mt-1
    ">

    🍕 Mesa {tableId}

    </h1>


    <p className="
    text-gray-400
    mt-2
    ">

    Cuenta #{accountId}

    </p>


    </div>


    <div className="
    bg-yellow-500
    text-black
    px-4
    py-2
    rounded-xl
    font-bold
    ">

    🟡 En atención

    </div>


    </div>





    <div className="
    grid
    grid-cols-1
    lg:grid-cols-3
    gap-6
    ">





    {/* CARTA */}


    <div className="
    lg:col-span-2
    ">


    <div className="
    bg-gray-900
    border
    border-gray-800
    rounded-2xl
    p-6
    ">


    <h2 className="
    text-2xl
    font-bold
    mb-5
    ">

    🍕 Carta

    </h2>



    <div className="
    grid
    grid-cols-2
    md:grid-cols-3
    gap-4
    ">



    {
    products.map(product=>(


    <div
    key={product.id}
    className="
    bg-gray-800
    border
    border-gray-700
    rounded-xl
    p-4
    hover:border-red-500
    transition
    "
    >


    <div className="
    h-24
    bg-gray-700
    rounded-xl
    flex
    items-center
    justify-center
    mb-4
    ">

    🍕

    </div>



    <h3 className="
    font-bold
    text-lg
    ">

    {product.name}

    </h3>



    <p className="
    text-yellow-400
    font-bold
    mt-2
    ">

    S/ {Number(product.price).toFixed(2)}

    </p>



    <button

    onClick={()=>
    addProduct(product)
    }

    className="
    mt-4
    w-full
    bg-red-600
    hover:bg-red-700
    py-2
    rounded-xl
    font-bold
    "

    >

    + Agregar

    </button>



    </div>


    ))

    }

    </div>


    </div>


    </div>




    {/* COMANDA */}


    <div>


    <div className="
    bg-gray-900
    border
    border-gray-800
    rounded-2xl
    p-6
    sticky
    top-5
    ">



    <h2 className="
    text-2xl
    font-bold
    mb-5
    ">

    📋 Comanda

    </h2>

    {/* PEDIDO ACTUAL */}



    {
    existingOrder.length > 0 && (


    <div className="
    mb-6
    border-b
    border-gray-700
    pb-5
    ">


    <h3 className="
    font-bold
    text-lg
    mb-3
    text-yellow-400
    ">

    Pedido actual

    </h3>



    {
    existingOrder.map(item=>(


    <div
    key={item.product.id}
    className="
    flex
    justify-between
    py-2
    text-gray-300
    "
    >


    <span>

    🍕 {item.product.name}

    </span>


    <span>

    x{item.quantity}

    </span>



    </div>


    ))

    }



    </div>


    )

    }

    {/* NUEVA COMANDA */}



    <h3 className="
    font-bold
    text-lg
    mb-3
    text-red-400
    ">

    Nueva comanda

    </h3>




    {
    cart.length===0 ? (


    <div className="
    bg-gray-800
    rounded-xl
    p-5
    text-gray-400
    text-center
    ">

    Selecciona productos para agregar

    </div>



    ):(


    <div className="
    space-y-3
    ">


    {
    cart.map(item=>(


    <div

    key={item.product.id}

    className="
    bg-gray-800
    rounded-xl
    p-4
    "

    >


    <div className="
    flex
    justify-between
    ">


    <div>


    <p className="
    font-bold
    ">

    {item.product.name}

    </p>


    <p className="
    text-yellow-400
    ">

    S/ {Number(item.product.price).toFixed(2)}

    </p>


    </div>




    <button

    onClick={()=>
    removeProduct(item.product.id)
    }

    className="
    text-red-400
    "

    >

    ✕


    </button>


    </div>





    <div className="
    flex
    items-center
    gap-4
    mt-3
    ">


    <button

    onClick={()=>
    changeQuantity(
    item.product.id,
    -1
    )
    }

    className="
    bg-gray-700
    px-3
    rounded-lg
    "

    >

    -

    </button>



    <span className="font-bold">

    {item.quantity}

    </span>



    <button

    onClick={()=>
    changeQuantity(
    item.product.id,
    1
    )
    }

    className="
    bg-gray-700
    px-3
    rounded-lg
    "

    >

    +

    </button>



    </div>


    </div>



    ))

    }


    </div>

    )

    }

    {/* TOTAL */}

    <div className="
    border-t
    border-gray-700
    mt-6
    pt-5
    ">


    <p className="
    text-gray-400
    ">

    Total acumulado

    </p>



    <h2 className="
    text-4xl
    font-bold
    text-yellow-400
    mt-2
    ">

    S/ {total.toFixed(2)}

    </h2>



    </div>

    <button

    onClick={sendOrder}

    disabled={
    cart.length===0 ||
    sending
    }


    className="
    w-full
    mt-6
    bg-red-600
    hover:bg-red-700
    disabled:opacity-40
    py-3
    rounded-xl
    font-bold
    "

    >

    {
    sending
    ?
    "Enviando..."
    :
    "🍳 Enviar a cocina"

    }

    </button>

    {
    existingOrder.length>0 && (

    <button

    onClick={()=>
    navigate(
    `/caja?accountId=${accountId}`
    )
    }

    className="
    w-full
    mt-3
    bg-yellow-500
    hover:bg-yellow-600
    text-black
    py-3
    rounded-xl
    font-bold
    "

    >
    💵 Ir a Caja

    </button>
    )

    }

    </div>

    </div>

    </div>

    </div>
        );
    }