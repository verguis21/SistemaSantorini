import {
createBrowserRouter
} from "react-router-dom";


import DashboardLayout from "../layouts/DashboardLayout";


import Dashboard from "../pages/Dashboard";
import Salon from "../pages/Salon";
import Products from "../pages/Products";
import Kitchen from "../pages/Kitchen";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Orders from "../pages/Orders";

export const router=createBrowserRouter([

{
path:"/",
element:<Login/>
},


{
element:<DashboardLayout/>,

children:[

{
path:"dashboard",
element:<Dashboard/>
},

{
path:"salon",
element:<Salon/>
},

{
path:"productos",
element:<Products/>
},

{
path: "pedidos",
element: <Orders />
},

{
path:"cocina",
element:<Kitchen/>
},

{
path:"caja",
element:<Checkout/>
}

]

}

])