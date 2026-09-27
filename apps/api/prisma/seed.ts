import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main(){


console.log("🌱 Iniciando seed...");


// ======================
// USUARIOS
// ======================


const admin = await prisma.user.create({
    data:{
        name:"Administrador",
        email:"admin@santorini.com",
        password:"123456",
        role:"ADMIN"
    }
});


const cajero = await prisma.user.create({
    data:{
        name:"Cajero",
        email:"cajero@santorini.com",
        password:"123456",
        role:"CAJERO"
    }
});


const cocina = await prisma.user.create({
    data:{
        name:"Cocina",
        email:"cocina@santorini.com",
        password:"123456",
        role:"COCINA"
    }
});



// ======================
// MESAS 40
// ======================


for(let i=1;i<=40;i++){

    await prisma.diningTable.create({

        data:{
            number:i,
            status:"FREE"
        }

    });

}



// ======================
// CATEGORIAS
// ======================


const pizzas = await prisma.category.create({
    data:{
        name:"Pizzas"
    }
});


const hamburguesas = await prisma.category.create({
    data:{
        name:"Hamburguesas"
    }
});


const pastas = await prisma.category.create({
    data:{
        name:"Pastas"
    }
});


const bebidas = await prisma.category.create({
    data:{
        name:"Bebidas"
    }
});


const postres = await prisma.category.create({
    data:{
        name:"Postres"
    }
});



// ======================
// PRODUCTOS
// ======================


await prisma.product.createMany({

data:[

{
name:"Pizza Margarita",
price:25,
categoryId:pizzas.id
},

{
name:"Pizza Pepperoni",
price:30,
categoryId:pizzas.id
},

{
name:"Pizza Hawaiana",
price:28,
categoryId:pizzas.id
},

{
name:"Pizza Suprema",
price:35,
categoryId:pizzas.id
},


{
name:"Hamburguesa Clásica",
price:18,
categoryId:hamburguesas.id
},

{
name:"Hamburguesa Royal",
price:25,
categoryId:hamburguesas.id
},


{
name:"Spaghetti Bolognesa",
price:22,
categoryId:pastas.id
},

{
name:"Lasagna",
price:28,
categoryId:pastas.id
},


{
name:"Inca Kola",
price:5,
categoryId:bebidas.id
},

{
name:"Coca Cola",
price:5,
categoryId:bebidas.id
},

{
name:"Agua",
price:3,
categoryId:bebidas.id
},


{
name:"Cheesecake",
price:12,
categoryId:postres.id
},

{
name:"Brownie",
price:10,
categoryId:postres.id
}

]

});



console.log("✅ Seed completado");


}


main()

.catch(e=>{

console.error(e);

process.exit(1);

})

.finally(async()=>{

await prisma.$disconnect();

});