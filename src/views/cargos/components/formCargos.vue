<template>
  <el-form ref="formRef" style="max-width: 100%" :model="formulario" :rules="rulesForm" label-width="auto"
    :size="formSize" status-icon>
    <el-form-item label="Nombre" prop="nombre">
      <el-input v-model="formulario.nombre" />
    </el-form-item>
    <el-form-item label="Salario" prop="salario">
      <el-input v-model="formulario.salario" />
    </el-form-item>
    <el-form-item label="Tipo de usuario" prop="tipo_usuario">
      <el-select v-model="formulario.tipo_usuario" placeholder="Seleccione un tipo de usuario">
        <el-option v-for="tipo in tipo_usuarios" :key="tipo.id" :label="tipo.nombre" :value="tipo.id" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { defineProps, reactive, watch, ref } from 'vue';

const props = defineProps({
  tipo_usuarios: {
    type: Array,
    required: true,
  },
  dataValue: {
    type: Object,
    required: false,
  },
});

const tipo_usuarios = ref(props.tipo_usuarios); // Asegurarse de que es una ref reactiva
const formSize = ref('default');
const formRef = ref();
const formulario = reactive({
  nombre: '',
  salario: '',
  tipo_usuario: '',
});

watch(
  () => props.tipo_usuarios, // Observa cualquier cambio en tipo_usuarios
  (newTipoUsuarios) => {
    tipo_usuarios.value = newTipoUsuarios; // Actualiza el array de tipos de usuario
  }
);

watch(
  () => props.dataValue,
  (newData) => {
    if (newData) {
      formulario.nombre = newData.nombre;
      formulario.salario = newData.salario;
      formulario.tipo_usuario = newData.tipo_usuario_id;
    }
  }
);

const rulesForm = reactive({
  nombre: [
    { required: true, message: 'Por favor ingrese el nombre', trigger: 'blur' }
  ],
  salario: [
    { required: true, message: 'Ingrese el salario', trigger: 'blur' },
  ],
  tipo_usuario: [
    { required: true, message: 'Seleccione un valor', trigger: 'blur' },
  ],
});

const limpiarFormulario = () => {
  formRef.value.resetFields();
};

const validarFormulario = () => {
  return new Promise((resolve) => {
    formRef.value?.validate((valid) => {
      resolve(valid);
    });
  });
};

defineExpose({ validarFormulario, formulario, limpiarFormulario });
</script>

<style scoped></style>
