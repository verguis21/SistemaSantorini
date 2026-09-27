interface Props {

    number:number;
    status:string;
    onClick:()=>void;

}


export default function TableCard({
    number,
    status,
    onClick
}:Props){


return (

<button

onClick={onClick}

className={`
p-5 rounded-xl shadow text-left
transition hover:scale-105

${status==="FREE"
?
"bg-green-100 border-green-500"
:
"bg-red-100 border-red-500"
}

border-2

`}

>


<h2 className="text-xl font-bold">

Mesa {number}

</h2>


<p className="mt-2">

{
status==="FREE"
?
"🟢 Disponible"
:
"🔴 Ocupada"
}

</p>


</button>


)

}