<template>
    <el-form
      ref="formRef"
      style="max-width: 100%"
      :model="formulario"
      :rules="rulesForm"
      label-width="auto"
      :size="formSize"
      status-icon
    >
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="formulario.nombre" />
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
  });
  
  // Observa cambios en `dataValue` y actualiza el formulario
  watch(
    () => props.dataValue,
    (newData) => {
      formulario.nombre = newData?.nombre || ''; // Maneja casos donde `newData` puede ser null o undefined
    },
    { immediate: true }
  );
  
  // Reglas de validación para el formulario
  const rulesForm = reactive({
    nombre: [
      {
        required: true,
        message: 'Por favor ingrese el nombre de la clase',
        trigger: 'blur',
      },
    ],
  });
  
  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    formRef.value.resetFields();
  };
  
  // Función para validar el formulario
  const validarFormulario = () => {
    return new Promise((resolve) => {
      formRef.value?.validate((valid) => {
        resolve(valid);
      });
    });
  };
  
  // Expone funciones y propiedades necesarias
  defineExpose({ validarFormulario, formulario, limpiarFormulario });
  </script>  