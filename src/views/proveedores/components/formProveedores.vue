<template>
  <el-form ref="formRef" style="max-width: 100%" :model="formulario" :rules="rulesForm" label-width="auto" :size="formSize" status-icon>
    <el-form-item label="Nombre" prop="nombre">
      <el-input v-model="formulario.nombre" />
    </el-form-item>

    <el-form-item label="Apellido" prop="apellido">
      <el-input v-model="formulario.apellido" />
    </el-form-item>

    <el-form-item label="Empresa" prop="empresa">
      <el-input v-model="formulario.empresa" />
    </el-form-item>

    <el-form-item label="Cargo" prop="cargo">
      <el-input v-model="formulario.cargo" />
    </el-form-item>

    <el-form-item label="Dirección" prop="direccion">
      <el-input v-model="formulario.direccion" />
    </el-form-item>

    <el-form-item label="Teléfono" prop="telefono">
      <el-input v-model="formulario.telefono" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';

const props = defineProps({
  dataValue: {
    type: Object,
    required: false,
  },
});

const formSize = ref('default');
const formRef = ref();
const formulario = reactive({
  nombre: '',
  apellido: '',
  empresa: '',
  cargo: '',
  direccion: '',
  telefono: '',
});

watch(
  () => props.dataValue,
  (newData) => {
    if (newData) {
      formulario.nombre = newData.nombre || '';
      formulario.apellido = newData.apellido || '';
      formulario.empresa = newData.empresa || '';
      formulario.cargo = newData.cargo || '';
      formulario.direccion = newData.direccion || '';
      formulario.telefono = newData.telefono || '';
    }
  },
  { immediate: true }
);

const rulesForm = reactive({
  nombre: [
    { required: true, message: 'Por favor ingrese el nombre del proveedor', trigger: 'blur' }
  ],
  apellido: [
    { required: true, message: 'Por favor ingrese el apellido del proveedor', trigger: 'blur' }
  ],
  empresa: [
    { required: true, message: 'Por favor ingrese la empresa del proveedor', trigger: 'blur' }
  ],
  cargo: [
    { required: true, message: 'Por favor ingrese el cargo del proveedor', trigger: 'blur' }
  ],
  direccion: [
    { required: true, message: 'Por favor ingrese la dirección del proveedor', trigger: 'blur' }
  ],
  telefono: [
    { required: true, message: 'Por favor ingrese el teléfono del proveedor', trigger: 'blur' }
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