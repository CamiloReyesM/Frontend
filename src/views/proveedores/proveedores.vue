<template>
  <LayoutMain>
    <template #slotLayout>
      <Header :titulo="'Proveedores'" :tituloBoton="'Crear Proveedor'" :abrir="abrirFormulario" />

      <!-- Formulario para crear/editar proveedor -->
      <Formulario :titulo="'Gestión de Proveedor'" 
      v-model:is-open="mostrarFormulario" 
      :is-edit="editandoFormulario" 
      @save="guardarProveedor" @update="actualizarProveedor">
        <template #slotForm>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <FormProveedor v-model:is-open="mostrarFormulario" :is-edit="editandoFormulario" 
              ref="formRef" :dataValue="someData" />
            </el-col>
          </el-row>
        </template>
      </Formulario>

      <!-- Tabla de proveedores -->
      <el-table :data="proveedores" stripe style="width: 100%">
        <el-table-column prop="nombre" label="Nombre" />
        <el-table-column prop="apellido" label="Apellido" />
        <el-table-column prop="empresa" label="Empresa" />
        <el-table-column prop="cargo" label="Cargo" />
        <el-table-column prop="direccion" label="Dirección" />
        <el-table-column prop="telefono" label="Telefono" />
        <el-table-column fixed="right" label="Acciones" min-width="120">
          <template #default="registro">
            <el-button link type="primary" size="large" :icon="Edit" @click="editarFormulario(registro.row.id)" />
            <el-button link type="danger" :icon="Delete" @click="eliminarProveedor(registro.row.id)" />
          </template>
        </el-table-column>
      </el-table>
    </template>
  </LayoutMain>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import LayoutMain from '../../components/LayoutMain.vue'
import Formulario from '../../components/Formulario.vue'
import Header from '../../components/Header.vue'
import { Delete, Edit } from "@element-plus/icons-vue"
import FormProveedor from './components/formProveedores.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const mostrarFormulario = ref(false)
const editandoFormulario = ref(false)
const formRef = ref()
const someData = ref(null) // Cambié a null, porque podría no haber datos al inicio
const proveedores = ref([])

const abrirFormulario = () => {
  mostrarFormulario.value = true
  editandoFormulario.value = false
}

const editarFormulario = async (id) => {
  someData.value = await datosById(id)
  console.log("Datos cargados para editar:", someData.value)
  mostrarFormulario.value = true
  editandoFormulario.value = true
}

const guardarProveedor = async () => {
  const validacion = await formRef.value?.validarFormulario()
  if (validacion) {
    await crearProveedor()
  }
}

const actualizarProveedor = async () => {
  if (!someData.value?.id) {
    ElMessage({
      message: 'ID de proveedor no válido.',
      type: 'error',
    })
    return
  }

  const url = `http://127.0.0.1:8000/api/proveedores/update/${someData.value.id}`

  try {
    const response = await axios.put(url, {
      nombre: formRef.value.formulario.nombre,
      apellido: formRef.value.formulario.apellido,
      empresa: formRef.value.formulario.empresa,
      cargo: formRef.value.formulario.cargo,
      direccion: formRef.value.formulario.direccion,
      telefono: formRef.value.formulario.telefono,
    })
    console.log('Respuesta de la actualización:', response)

    ElMessage({
      message: 'Proveedor actualizado con éxito.',
      type: 'success',
    })

    obtenerProveedores()

    formRef.value?.limpiarFormulario()
    mostrarFormulario.value = false
  } catch (error) {
    console.error('Error al actualizar el proveedor:', error)

    ElMessage({
      message: 'Hubo un error al actualizar el proveedor.',
      type: 'error',
    })
  }
}

const crearProveedor = async () => {
  const url = `http://127.0.0.1:8000/api/proveedores/save`

  const dataFormulario = {
    nombre: formRef.value.formulario.nombre,
    apellido: formRef.value.formulario.apellido,
    empresa: formRef.value.formulario.empresa,
    cargo: formRef.value.formulario.cargo,
    direccion: formRef.value.formulario.direccion,
    telefono: formRef.value.formulario.telefono,
  }
  try {
    axios.post(url, dataFormulario)
      .then(function (response) {
        console.log(response)
        formRef.value?.limpiarFormulario()
        ElMessage({
          message: 'Proveedor creado con éxito.',
          type: 'success',
        })
        obtenerProveedores()
        mostrarFormulario.value = false
      })
      .catch(function (error) {
        console.log(error)
      })
  } catch (error) {
    console.error('error crear proveedor ', error)
  }
}

const datosById = async (id) => {
  const url = `http://127.0.0.1:8000/api/proveedores/datosById/${id}`

  try {
    const response = await axios.get(url)
    console.log('Datos obtenidos por ID:', response.data.result)
    return response.data.result
  } catch (error) {
    console.error('Error al obtener el proveedor por ID:', error)
    ElMessage({
      message: 'Hubo un error al cargar los datos del proveedor.',
      type: 'error',
    })
    return null
  }
}

const eliminarProveedor = async (id) => {
  const url = `http://127.0.0.1:8000/api/proveedores/delete/${id}`

  ElMessageBox.confirm(
    '¿Está seguro de eliminar el proveedor?',
    'Eliminar Registro',
    {
      confirmButtonText: 'SI',
      cancelButtonText: 'Cancelar',
      type: 'error',
    }
  )
    .then(() => {
      try {
        axios.delete(url, { data: { id } })
          .then(function (response) {
            obtenerProveedores()
          })
          .catch(function (error) {
            console.log(error)
          })
      } catch (error) {
        console.error('error eliminar proveedor', error)
      }
      ElMessage({
        type: 'success',
        message: 'Proveedor eliminado correctamente',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Eliminación cancelada',
      })
    })
}

const obtenerProveedores = async () => {
  const url = `http://127.0.0.1:8000/api/proveedores/datos`

  try {
    axios.get(url)
      .then(function (response) {
        proveedores.value = response.data.result
      })
      .catch(function (error) {
        console.log(error)
      })
  } catch (error) {
    console.error('error obtener proveedores', error)
  }
}

onMounted(() => {
  obtenerProveedores()
})
</script>