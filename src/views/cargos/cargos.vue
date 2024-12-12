<template>
    <LayoutMain>
        <template #slotLayout>
            <Header :titulo="'Cargos'" :tituloBoton="'Crear Cargo '" :abrir="abrirFormulario" />

            <Formulario :titulo="'Gestion de Cargos'" v-model:is-open="mostrarFormulario" :is-edit="editandoFormulario"
                @save="guardarDatos" @update="actualizarDatos">
                <template #slotForm>
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <FormCargos v-model:is-open="mostrarFormulario" :is-edit="editandoFormulario" ref="formRef"
                                :tipo_usuarios="tipoUsuarios" :dataValue="someData" />
                        </el-col>
                    </el-row>
                </template>
            </Formulario>

            <el-table :data="cargos" stripe style="width: 100%">
                <el-table-column prop="nombre" label="nombre" />
                <el-table-column prop="salario" label="salario" />
                <el-table-column prop="tipo_usuario_id" label="Tipo de usuario" />
                <el-table-column fixed="right" label="Acciones" min-width="120">
                    <template #default="registro">
                        <el-button link type="primary" size="large" :icon="Edit"
                            @click="editarFormulario(registro.row.id)">
                        </el-button>
                        <el-button link type="danger" :icon="Delete"
                            @click="eliminarCargo(registro.row.id)"></el-button>
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
import FormCargos from './components/formCargos.vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios';

const mostrarFormulario = ref(false);
const editandoFormulario = ref(false);
const formRef = ref();
const someData = ref<Record<string, any> | null>(null);  // Cambié a null, porque podría no haber datos al inicio
const tipoUsuarios = ref([]);
const cargos = ref([]);

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
        await crearCargo();
    }
};

const actualizarDatos = async () => {
    const validacion = await formRef.value?.validarFormulario();
    if (validacion) {
        await actualizarCargo();
    }
};

const crearCargo = async () => {
    const url = `http://127.0.0.1:8000/api/cargos/save`;

    const dataFormulario = {
        id: someData.value?.id ?? '',
        nombre: formRef.value.formulario.nombre,
        salario: formRef.value.formulario.salario,
        tipo_usuario_id: formRef.value.formulario.tipo_usuario
    };
    try {
        axios.post(url, dataFormulario)
            .then(function (response) {
                console.log(response);
                formRef.value?.limpiarFormulario();
                ElMessage({
                    message: 'El cargo se creo con exito.',
                    type: 'success',
                });
                datosCargo();
                mostrarFormulario.value = false;
            })
            .catch(function (error) {
                console.log(error);
            });

    } catch (error) {
        console.error('error crear cargo ', error);
    }
};

const actualizarCargo = async () => {
    // Verifica que el ID esté presente y no sea undefined
    console.log("Datos de someData:", someData.value);  // Verifica si el id está disponible
    const dataFormulario = {
        id: someData.value?.id,  // Usando optional chaining para evitar errores si es undefined
        nombre: formRef.value.formulario.nombre,
        salario: formRef.value.formulario.salario,
        tipo_usuario_id: formRef.value.formulario.tipo_usuario
    };

    if (!dataFormulario.id) {
        console.error("ID no válido o no encontrado.");
        return;  // Detén la ejecución si el ID no es válido
    }

    const url = `http://127.0.0.1:8000/api/cargos/update/${dataFormulario.id}`;  // Incluye el ID en la URL
    try {
        const response = await axios.put(url, dataFormulario);  // Usando PUT para la actualización
        console.log(response);
        formRef.value?.limpiarFormulario();
        ElMessage({
            message: 'El cargo se actualizo con exito.',
            type: 'success',
        });
        datosCargo();
        mostrarFormulario.value = false;
    } catch (error) {
        console.error('Error en la actualización:', error);
    }
};

const datosById = async (id) => {
    const url = `http://127.0.0.1:8000/api/cargos/datosById/${id}`;

    try {
        const response = await axios.get(url);
        return response.data.result;  // Verifica que la respuesta tenga la propiedad 'result'
    } catch (error) {
        console.error('Error al obtener cargo por ID:', error);
    }
};

const eliminarCargo = async (id) => {
    const url = `http://127.0.0.1:8000/api/cargos/delete/${id}`;

    ElMessageBox.confirm(
        'Esta seguro de eliminar el cargo ',
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
                        datosCargo();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } catch (error) {
                console.error('error crear cargo ', error);
            }
            ElMessage({
                type: 'success',
                message: 'Se elimino correctamente el registro',
            });
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Eliminacion cancelada',
            });
        });
};

const datosCargo = async () => {
    const url = `http://127.0.0.1:8000/api/cargos/datos`;

    try {
        axios.get(url)
            .then(function (response) {
                cargos.value = response.data.result;
            })
            .catch(function (error) {
                console.log(error);
            });

    } catch (error) {
        console.error('error obtener cargos ', error);
    }
};

const getTipo_usuarios = async () => {
    const url = 'http://127.0.0.1:8000/api/tipousuarios/datos';

    try {
        const response = await axios.get(url);
        tipoUsuarios.value = response.data.result;
    } catch (error) {
        console.error('Error al obtener tipo de usuarios:', error);
    }
};

onMounted(() => {
    getTipo_usuarios();
    datosCargo();
});

</script>