<template>
    <el-form ref="formRef" style="max-width: 100%" :model="formulario" :rules="rulesForm" label-width="auto"
      :size="formSize" status-icon>
      
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="formulario.nombre" />
      </el-form-item>
    </el-form>
  </template>
  
  <script setup>
  import { defineProps, reactive, watch, ref } from 'vue';
  
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
  
  watch(
    () => props.dataValue,
    (newData) => {
      if (newData) {
        formulario.nombre = newData.nombre;
      }
    },
    { immediate: true }
  );
  
  const rulesForm = reactive({
    nombre: [
      { required: true, message: 'Por favor ingrese el nombre del tipo de usuario', trigger: 'blur' }
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

  watch(
    () => props.dataValue,
    (newData) => {
      if (newData) {
        formulario.nombre = newData.nombre || '';
      }
    },
    { immediate: true }
  )
  
  defineExpose({ validarFormulario, formulario, limpiarFormulario });
  </script>
  