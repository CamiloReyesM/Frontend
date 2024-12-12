<template>
  <LayoutMain>
    <template #slotLayout>
      <Header :titulo="'Tipos de Usuarios'" :tituloBoton="'Crear Tipo de Usuario '" :abrir="abrirFormulario" />

      <Formulario :titulo="'Gestión de Tipos de Usuario'" v-model:is-open="mostrarFormulario" :is-edit="editandoFormulario"
        @save="guardarDatos" @update="actualizarDatos">
        <template #slotForm>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <FormTipoUsuario v-model:is-open="mostrarFormulario" :is-edit="editandoFormulario" ref="formRef"
                :dataValue="someData" />
            </el-col>
          </el-row>
        </template>
      </Formulario>

      <el-table :data="tiposUsuarios" stripe style="width: 100%">
        <el-table-column prop="nombre" label="Nombre" />
        <el-table-column fixed="right" label="Acciones" min-width="120">
          <template #default="registro">
            <el-button link type="primary" size="large" :icon="Edit"
              @click="editarFormulario(registro.row.id)">
            </el-button>
            <el-button link type="danger" :icon="Delete"
              @click="eliminarTipoUsuario(registro.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

    </template>
  </LayoutMain>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import LayoutMain from '../../components/LayoutMain.vue';
import Formulario from '../../components/Formulario.vue';
import Header from '../../components/Header.vue';
import { Delete, Edit } from "@element-plus/icons-vue"
import FormTipoUsuario from './components/formTipoUsuario.vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios';

const mostrarFormulario = ref(false);
const editandoFormulario = ref(false);
const formRef = ref();
const someData = ref(null);  // Cambié a null, porque podría no haber datos al inicio
const tiposUsuarios = ref([]);

const abrirFormulario = () => {
  mostrarFormulario.value = true;
  editandoFormulario.value = false;
};

const editarFormulario = async (id) => {
  someData.value = await datosById(id);
  console.log("Datos cargados para editar:", someData.value);  // Verifica qué contiene someData
  mostrarFormulario.value = true;
  editandoFormulario.value = true;
};

const guardarDatos = async () => {
  const validacion = await formRef.value?.validarFormulario();
  if (validacion) {
    await crearTipoUsuario();
  }
};

const actualizarDatos = async () => {
  const validacion = await formRef.value?.validarFormulario();
  if (validacion) {
    await actualizarTipoUsuario();
  }
};

const crearTipoUsuario = async () => {
  const url = `http://127.0.0.1:8000/api/tipousuarios/save`;

  const dataFormulario = {
    nombre: formRef.value.formulario.nombre
  };
  try {
    axios.post(url, dataFormulario)
      .then(function (response) {
        console.log(response);
        formRef.value?.limpiarFormulario();
        ElMessage({
          message: 'El tipo de usuario se creo con exito.',
          type: 'success',
        });
        obtenerTiposUsuarios();
        mostrarFormulario.value = false;
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.error('error crear tipo de usuario ', error);
  }
};

  const actualizarTipoUsuario = async () => {
  // Verifica si el ID de someData es válido
  if (!someData.value?.id) {
    ElMessage({
      message: 'ID de tipo de usuario no válido.',
      type: 'error',
    });
    return;
  }

  const url = `http://127.0.0.1:8000/api/tipousuarios/update/${someData.value.id}`;

  try {
    const response = await axios.put(url, {
      nombre: formRef.value.formulario.nombre, // Campo correcto del formulario
    });
    console.log('Respuesta de la actualización:', response);

    // Muestra mensaje de éxito
    ElMessage({
      message: 'Tipo de usuario actualizado con éxito.',
      type: 'success',
    });
  // Actualiza la lista de tipos de usuarios
  obtenerTiposUsuarios();

// Limpia el formulario y cierra el modal
formRef.value?.limpiarFormulario();
mostrarFormulario.value = false;
} catch (error) {
console.error('Error al actualizar el tipo de usuario:', error);

// Muestra mensaje de error
ElMessage({
  message: 'Hubo un error al actualizar el tipo de usuario.',
  type: 'error',
});
}
};

const datosById = async (id) => {
  const url = `http://127.0.0.1:8000/api/tipousuarios/datosById/${id}`;

  try {
    const response = await axios.get(url);
    console.log('Datos obtenidos por ID:', response.data.result);
    return response.data.result; // Asegúrate de que la API devuelve 'result' con los datos esperados
  } catch (error) {
    console.error('Error al obtener tipo de usuario por ID:', error);
    ElMessage({
      message: 'Hubo un error al cargar los datos del tipo de usuario.',
      type: 'error',
    });
    return null;
  }
};

const eliminarTipoUsuario = async (id) => {
  const url = `http://127.0.0.1:8000/api/tipousuarios/delete/${id}`;

  ElMessageBox.confirm(
    '¿Está seguro de eliminar el tipo de usuario?',
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
            obtenerTiposUsuarios();
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (error) {
        console.error('error eliminar tipo de usuario ', error);
      }
      ElMessage({
        type: 'success',
        message: 'Se eliminó correctamente el tipo de usuario',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Eliminación cancelada',
      });
    });
};

const obtenerTiposUsuarios = async () => {
  const url = `http://127.0.0.1:8000/api/tipousuarios/datos`;

  try {
    axios.get(url)
      .then(function (response) {
        tiposUsuarios.value = response.data.result;
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.error('error obtener tipos de usuarios ', error);
  }
};

onMounted(() => {
  obtenerTiposUsuarios();
});
</script>
