<template>
  <el-form :model="formulario" :rules="reglas" ref="form" label-width="120px">
    <el-form-item label="Nombre" prop="nombre">
      <el-input v-model="formulario.nombre" placeholder="Ingrese el nombre del producto"></el-input>
    </el-form-item>

    <el-form-item label="Precio" prop="precio">
      <el-input-number v-model="formulario.precio" :min="0" placeholder="Ingrese el precio"></el-input-number>
    </el-form-item>

    <el-form-item label="Clase" prop="clase">
      <el-select v-model="formulario.clase" placeholder="Seleccione una clase">
        <el-option v-for="clase in clases" :key="clase.id" :label="clase.nombre" :value="clase.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Proveedor" prop="proveedor">
      <el-select v-model="formulario.proveedor" placeholder="Seleccione un proveedor">
        <el-option v-for="proveedor in proveedores" :key="proveedor.id" :label="proveedor.nombre" :value="proveedor.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button @click="limpiarFormulario">Limpiar</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  isEdit: Boolean,
  dataValue: Object,
  clases: Array,
  proveedores: Array,
});

const form = ref();
const formulario = ref({
  nombre: '',
  precio: null,
  clase: null,
  proveedor: null,
});

const reglas = {
  nombre: [{ required: true, message: 'El nombre es obligatorio', trigger: 'blur' }],
  precio: [{ required: true, message: 'El precio es obligatorio', trigger: 'blur' }],
  clase: [{ required: true, message: 'La clase es obligatoria', trigger: 'change' }],
  proveedor: [{ required: true, message: 'El proveedor es obligatorio', trigger: 'change' }],
};

// Cargar datos si se está editando
watch(() => props.isEdit, (nuevoValor) => {
  if (nuevoValor && props.dataValue) {
    formulario.value = { ...props.dataValue };
  }
});

// Validar el formulario antes de guardar o actualizar
const validarFormulario = async () => {
  try {
    await form.value.validate();
    return true;
  } catch (error) {
    console.error("Error en la validación del formulario:", error);
    return false;
  }
};

// Limpiar el formulario
const limpiarFormulario = () => {
  form.value.resetFields();
};

// Exponer métodos para acceso desde el componente padre
defineExpose({
  validarFormulario,
  limpiarFormulario,
});
</script>