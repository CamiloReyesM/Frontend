import {createRouter, createWebHistory} from 'vue-router'
import Cargos from '../views/cargos/cargos.vue'
import Empleados from '../views/empleados/empleados.vue'
import Tipousuarios from '../views/tipousuarios/tipousuario.vue'
import Clases from '../views/clases/clases.vue'
import Proveedores from '../views/proveedores/proveedores.vue'
import Productos from '../views/productos/productos.vue'
import LayoutMain from '../components/LayoutMain.vue'
import Login from '../components/Login.vue'

const routes =[

{
    path:'/',
    name:'home',
    component:LayoutMain,
},
{
    path:'/login',
    name:'login',
    component:Login,
},
{
    path:'/cargos',
    name:'Cargos',
    component: Cargos,
},
{
    path:'/empleados',
    name:'Empleados',
    component: Empleados,
},
{
    path:'/tipousuarios',
    name:'Tipousuarios',
    component: Tipousuarios,
},
{
    path:'/clases',
    name:'Clases',
    component: Clases,
},
{
    path:'/proveedores',
    name:'Proveedores',
    component: Proveedores,
},
{
    path:'/productos',
    name:'Productos',
    component: Productos,
},

]

const router= createRouter({
    history:createWebHistory(),
    routes,
})

export default router;