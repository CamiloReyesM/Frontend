<template>
    <LayoutMain>
      <template #slotLayout>
        <Header :titulo="'Productos'" :tituloBoton="'Crear Producto'" :abrir="abrirFormulario" />
  
        <Formulario
          :titulo="'Gestión de Producto'"
          v-model:is-open="mostrarFormulario"
          :is-edit="editandoFormulario"
          @save="guardarDatos"
          @update="actualizarDatos"
        >
          <template #slotForm>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <FormProductos
                  v-model:is-open="mostrarFormulario"
                  :is-edit="editandoFormulario"
                  ref="formRef"
                  :dataValue="someData"
                  :clases="clases"
                  :proveedores="proveedores"
                  :precio-formatter="precioFormatter"
                  :precio-parser="precioParser"
                />
              </el-col>
            </el-row>
          </template>
        </Formulario>
  
        <el-table :data="productos" stripe style="width: 100%">
          <el-table-column prop="nombre" label="Nombre" />
          <el-table-column prop="precio" label="Precio" />
          <el-table-column prop="clase_id" label="Clase" />
          <el-table-column prop="proveedor_id" label="Proveedor" />
          <el-table-column fixed="right" label="Acciones" min-width="120">
            <template #default="registro">
              <el-button
                link
                type="primary"
                size="large"
                :icon="Edit"
                @click="editarFormulario(registro.row.id)"
              ></el-button>
              <el-button
                link
                type="danger"
                :icon="Delete"
                @click="eliminarProducto(registro.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </LayoutMain>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import LayoutMain from "../../components/LayoutMain.vue";
  import Formulario from "../../components/Formulario.vue";
  import Header from "../../components/Header.vue";
  import FormProductos from "./components/formProductos.vue";
  import { Delete, Edit } from "@element-plus/icons-vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import axios from "axios";
  
  const mostrarFormulario = ref(false);
  const editandoFormulario = ref(false);
  const formRef = ref();
  const someData = ref<Record<string, any> | null>(null);
  const clases = ref([]);
  const proveedores = ref([]);
  const productos = ref([]);
  
  const abrirFormulario = () => {
    mostrarFormulario.value = true;
    editandoFormulario.value = false;
  };
  
  const editarFormulario = async (id) => {
    someData.value = await datosById(id);
  
    if (someData.value) {
      // Solo extraer el id de clase y proveedor
      const claseId = someData.value.clase && Array.isArray(someData.value.clase) ? someData.value.clase[0]?.id : null;
      const proveedorId = someData.value.proveedor && Array.isArray(someData.value.proveedor) ? someData.value.proveedor[0]?.id : null;
  
      // Depuración: Verificar los datos antes de asignarlos al formulario
      console.log("Datos de producto a editar:", someData.value);
  
      // Asignar los valores al formulario
      mostrarFormulario.value = true;
      editandoFormulario.value = true;
      formRef.value.formulario = {
        nombre: someData.value.nombre || '',
        precio: someData.value.precio || 0,  // Asegúrate de que precio sea un número
        clase: claseId,   // Solo asigna el ID
        proveedor: proveedorId,  // Solo asigna el ID
      };
    }
  };
  
  const guardarDatos = async () => {
    const validacion = await formRef.value?.validarFormulario();
    if (validacion) await crearProducto();
  };
  
  const crearProducto = async () => {
    const url = "http://127.0.0.1:8000/api/productos/save";
    const dataFormulario = {
      id: someData.value?.id ?? "",  // Asegúrate de que el id esté bien
      nombre: formRef.value.nombre,
      precio: formRef.value.precio,
      clase_id: formRef.value.clase_id,  // Solo pasa el id de clase
      proveedor_id: formRef.value.proveedor_id,  // Solo pasa el id de proveedor
    };
  
    // Depuración: Verificar los datos antes de enviarlos
    console.log("Data a enviar:", dataFormulario);
  
    try {
      const response = await axios.post(url, dataFormulario);
      formRef.value?.limpiarFormulario();
      ElMessage({ message: "Producto creado con éxito", type: "success" });
      datosProducto();
      mostrarFormulario.value = false;
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };
  
  const actualizarProducto = async () => {
    if (!someData.value?.id) {
      ElMessage({ message: "ID no válido", type: "error" });
      return;
    }
  
    const formulario = formRef.value.formulario;
  
    const dataFormulario = {
      id: someData.value.id,
      nombre: formulario?.nombre || '',
      precio: formulario?.precio || 0,
      clase_id: formulario?.clase || null,  // Asegúrate de solo enviar el id
      proveedor_id: formulario?.proveedor || null,  // Asegúrate de solo enviar el id
    };
  
    console.log("Datos enviados:", dataFormulario); // Verificar los datos que estás enviando
    
    const url = `http://127.0.0.1:8000/api/productos/update/${someData.value.id}`;
  
    try {
      await axios.put(url, dataFormulario);
      ElMessage({ message: "Producto actualizado con éxito", type: "success" });
      datosProducto();
      mostrarFormulario.value = false;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      ElMessage({ message: "Error al actualizar producto", type: "error" });
    }
  };
  
  const datosById = async (id) => {
    const url = `http://127.0.0.1:8000/api/productos/datosById/${id}`;
    try {
      const response = await axios.get(url);
      return response.data.result;
    } catch (error) {
      console.error("Error al obtener datos del producto:", error);
    }
  };
  
  const eliminarProducto = async (id) => {
    const url = `http://127.0.0.1:8000/api/productos/delete/${id}`;
  
    ElMessageBox.confirm("¿Está seguro de eliminar el producto?", "Eliminar Registro", {
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
      type: "warning",
    })
      .then(async () => {
        try {
          await axios.delete(url);
          ElMessage({ type: "success", message: "Producto eliminado" });
          datosProducto();
        } catch (error) {
          console.error("Error al eliminar producto:", error);
        }
      })
      .catch(() => {
        ElMessage({ type: "info", message: "Eliminación cancelada" });
      });
  };
  
  const datosProducto = async () => {
    const url = "http://127.0.0.1:8000/api/productos/datos";
    try {
      const response = await axios.get(url);
      productos.value = response.data.result;
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };
  
  const getClases = async () => {
    const url = "http://127.0.0.1:8000/api/clases/datos";
    try {
      const response = await axios.get(url);
      clases.value = response.data.result;
    } catch (error) {
      console.error("Error al obtener clases:", error);
    }
  };
  
  const getProveedores = async () => {
    const url = "http://127.0.0.1:8000/api/proveedores/datos";
    try {
      const response = await axios.get(url);
      proveedores.value = response.data.result;
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };
  
  // Método para formatear el precio a dos decimales
  const precioFormatter = (value) => {
    return value ? `${value.toFixed(2)}` : '';
  };
  
  // Método para parsear el precio asegurando que sea un número
  const precioParser = (value) => {
    return parseFloat(value.replace(/[^0-9.-]+/g, ''));
  };
  
  onMounted(() => {
    datosProducto();
    getClases();
    getProveedores();
  });
  </script>  