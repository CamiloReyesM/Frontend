<template>
    <LayoutMain>
        <template #slotLayout>
            <Header :titulo="'Empleados'" :tituloBoton="'Crear Empleado '" :abrir="abrirFormulario" />
  
            <Formulario :titulo="'Gestion de Empleados'" v-model:is-open="mostrarFormulario" :is-edit="editandoFormulario"
                @save="guardarDatos" @update="actualizarDatos">
                <template #slotForm>
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <FormEmpleados v-model:is-open="mostrarFormulario" :is-edit="editandoFormulario" ref="formRef"
                                :cargos="cargos" :dataValue="someData" />
                        </el-col>
                    </el-row>
                </template>
            </Formulario>
  
            <el-table :data="empleados" stripe style="width: 100%">
                <el-table-column prop="nombre" label="Nombre" />
                <el-table-column prop="apellido" label="Apellido" />
                <el-table-column prop="cargo_id" label="Cargo" />
                <el-table-column prop="cc" label="C.C." />
                <el-table-column prop="telefono" label="Teléfono" />
                <el-table-column fixed="right" label="Acciones" min-width="120">
                    <template #default="registro">
                        <el-button link type="primary" size="large" :icon="Edit"
                            @click="editarFormulario(registro.row.id)">
                        </el-button>
                        <el-button link type="danger" :icon="Delete"
                            @click="eliminarEmpleado(registro.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
  
        </template>
    </LayoutMain>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, reactive, ref, watch } from 'vue'
  import LayoutMain from '../../components/LayoutMain.vue';
  import Formulario from '../../components/Formulario.vue';
  import Header from '../../components/Header.vue';
  import { Delete, Edit } from "@element-plus/icons-vue"
  import FormEmpleados from './components/formEmpleados.vue';
  import { ElMessage, ElMessageBox } from 'element-plus'
  import axios from 'axios';
  
  const mostrarFormulario = ref(false);
  const editandoFormulario = ref(false);
  const formRef = ref();
  const someData = ref(null);  // Cambié a null, porque podría no haber datos al inicio
  const cargos = ref([]);
  const empleados = ref([]);
  
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
        await crearEmpleado();
    }
  };
  
  const actualizarDatos = async () => {
    const validacion = await formRef.value?.validarFormulario();
    if (validacion) {
        await actualizarEmpleado();
    }
  };
  
  const crearEmpleado = async () => {
    const url = `http://127.0.0.1:8000/api/empleados/save`;
  
    const dataFormulario = {
        nombre: formRef.value.formulario.nombre,
        apellido: formRef.value.formulario.apellido,
        cargo_id: formRef.value.formulario.cargo_id,
        cc: formRef.value.formulario.cc,
        telefono: formRef.value.formulario.telefono
    };
    try {
        axios.post(url, dataFormulario)
            .then(function (response) {
                console.log(response);
                formRef.value?.limpiarFormulario();
                ElMessage({
                    message: 'El empleado se creo con exito.',
                    type: 'success',
                });
                datosEmpleados();
                mostrarFormulario.value = false;
            })
            .catch(function (error) {
                console.log(error);
            });
  
    } catch (error) {
        console.error('error crear empleado ', error);
    }
  };
  
  const actualizarEmpleado = async () => {
    console.log("Datos de someData:", someData.value); // Verifica si el id está disponible
    const dataFormulario = {
        id: someData.value?.id,  // Usando optional chaining para evitar errores si es undefined
        nombre: formRef.value.formulario.nombre,
        apellido: formRef.value.formulario.apellido,
        cargo_id: formRef.value.formulario.cargo_id,
        cc: formRef.value.formulario.cc,
        telefono: formRef.value.formulario.telefono
    };

    if (!dataFormulario.id) {
        console.error("ID no válido o no encontrado.");
        return; // Detén la ejecución si el ID no es válido
    }

    const url = `http://127.0.0.1:8000/api/empleados/update/${dataFormulario.id}`;
    try {
        const response = await axios.put(url, dataFormulario);
        console.log(response);
        formRef.value?.limpiarFormulario();
        ElMessage({
            message: 'El empleado se actualizó con éxito.',
            type: 'success',
        });
        datosEmpleados();
        mostrarFormulario.value = false;
    } catch (error) {
        console.error('Error en la actualización:', error);
    }
};
  
  const datosById = async (id) => {
    const url = `http://127.0.0.1:8000/api/empleados/datosById/${id}`;
  
    try {
        const response = await axios.get(url, { params: { id: id } });
        return response.data.result;  // Verifica que la respuesta tenga la propiedad 'result'
    } catch (error) {
        console.error('Error al obtener empleado por ID:', error);
    }
  };
  
  const eliminarEmpleado = async (id) => {
    const url = `http://127.0.0.1:8000/api/empleados/delete/${id}`;
  
    ElMessageBox.confirm(
        '¿Está seguro de eliminar el empleado?',
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
                        datosEmpleados();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } catch (error) {
                console.error('error eliminar empleado ', error);
            }
            ElMessage({
                type: 'success',
                message: 'Se eliminó correctamente el registro',
            });
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Eliminación cancelada',
            });
        });
  };
  
  const datosEmpleados = async () => {
    const url = `http://127.0.0.1:8000/api/empleados/datos`;
  
    try {
        axios.get(url)
            .then(function (response) {
                empleados.value = response.data.result;
            })
            .catch(function (error) {
                console.log(error);
            });
  
    } catch (error) {
        console.error('error obtener empleados ', error);
    }
  };
  
  const getCargos = async () => {
    const url = 'http://127.0.0.1:8000/api/cargos/datos';
  
    try {
        const response = await axios.get(url);
        cargos.value = response.data.result;
    } catch (error) {
        console.error('Error al obtener cargos:', error);
    }
  };
  
  onMounted(() => {
    getCargos();
    datosEmpleados();
  });
  </script>