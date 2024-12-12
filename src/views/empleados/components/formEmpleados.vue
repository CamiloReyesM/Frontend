<template>
    <el-form ref="formRef" style="max-width: 100%" :model="formulario" :rules="rulesForm" label-width="auto"
      :size="formSize" status-icon>
      
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="formulario.nombre" />
      </el-form-item>
  
      <el-form-item label="Apellido" prop="apellido">
        <el-input v-model="formulario.apellido" />
      </el-form-item>
  
      <el-form-item label="Cargo" prop="cargo_id">
        <el-select v-model="formulario.cargo_id" placeholder="Seleccione un cargo">
          <el-option v-for="cargo in cargos" :key="cargo.id" :label="cargo.nombre" :value="cargo.id" />
        </el-select>
      </el-form-item>
  
      <el-form-item label="C.C." prop="cc">
        <el-input v-model="formulario.cc" />
      </el-form-item>
  
      <el-form-item label="Teléfono" prop="telefono">
        <el-input v-model="formulario.telefono" />
      </el-form-item>
    </el-form>
  </template>
  
  <script setup>
  import { defineProps, reactive, watch, ref } from 'vue';
  
  const props = defineProps({
    cargos: {
      type: Array,
      required: true,
    },
    dataValue: {
      type: Object,
      required: false,
    },
  });
  
  const cargos = ref(props.cargos); // Asegurarse de que sea una ref reactiva
  const formSize = ref('default');
  const formRef = ref();
  const formulario = reactive({
    nombre: '',
    apellido: '',
    cargo_id: '', // Campo para el ID del cargo
    cc: '',
    telefono: '',
  });
  
  watch(
    () => props.cargos, // Observa cualquier cambio en cargos
    (newCargos) => {
      cargos.value = newCargos; // Actualiza el array de cargos
    }
  );
  
  watch(
    () => props.dataValue,
    (newData) => {
      if (newData) {
        formulario.nombre = newData.nombre;
        formulario.apellido = newData.apellido;
        formulario.cargo_id = newData.cargo_id;
        formulario.cc = newData.cc;
        formulario.telefono = newData.telefono;
      }
    }
  );
  
  const rulesForm = reactive({
    nombre: [
      { required: true, message: 'Por favor ingrese el nombre', trigger: 'blur' }
    ],
    apellido: [
      { required: true, message: 'Por favor ingrese el apellido', trigger: 'blur' }
    ],
    cargo_id: [
      { required: true, message: 'Seleccione un cargo', trigger: 'blur' }
    ],
    cc: [
      { required: true, message: 'Por favor ingrese la C.C.', trigger: 'blur' }
    ],
    telefono: [
      { required: true, message: 'Por favor ingrese el teléfono', trigger: 'blur' }
    ]
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