<template>
  <el-container v-show="isVisible" class="form-container">
    <el-row :gutter="5" class="form-container__row">
      <el-col :xs="18" :sm="18" :md="18" :lg="22" :xl="22" class="form-container__title-col">
        <el-button text class="form-container__title-button" size="large">
          {{ titulo }}
        </el-button>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="2" :xl="2" class="form-container__button-group">
        <el-button size="large" class="form-container__button-cancel" @click="irAtras">Cancelar</el-button>
        <el-button type="primary" size="large" class="form-container__button-submit" @click="submit">
          {{ tituloBoton }}
        </el-button>
      </el-col>
    </el-row>

    <el-main class="form-container__main">
      <slot name="slotForm"></slot>
    </el-main>
  </el-container>
</template>

<script setup>
import { computed } from 'vue';

// Definir propiedades
const props = defineProps({
  titulo: String,
  isEdit: Boolean,
  isOpen: Boolean,
});

// Computada para el título del botón
const tituloBoton = computed(() => (props.isEdit ? 'Actualizar' : 'Guardar'));

// Controlar visibilidad del formulario
const isVisible = computed(() => props.isOpen);

// Emitir eventos
const emit = defineEmits(['update:is-open', 'save', 'update']);

// Función para cerrar el formulario
const irAtras = () => {
  emit('update:is-open', false);
};

// Función para manejar la acción de guardar o actualizar
const submit = () => {
  if (props.isEdit) {
    emit('update'); // Emitir el evento de actualización
  } else {
    emit('save'); // Emitir el evento de guardado
  }
};
</script>

<style scoped>
.form-container {
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  right: 5px;
  width: 100%;
  z-index: 90;
  background-color: white;
  display: flex;
  flex-direction: column;
  height: calc(100vh + 42%);
}

.form-container__row {
  display: flex;
  align-items: center;
  padding: 10px;
}

/* Estilos del título del formulario */
.form-container__title-button {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Alinear los botones en la parte superior derecha */
.form-container__button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-container__button-submit {
  background-color: #2fbe98;
  border: none;
  color: white;
}
</style>