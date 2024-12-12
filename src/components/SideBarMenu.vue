<template>

        <el-menu
        :default-active="$route.path"
        router
          class="el-menu-vertical-demo"
          background-color="#242629"
          text-color="#fff"
          collapse-transition
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>Administrador</span>
            </template>
  
            <el-menu-item index="empleados">Empleados</el-menu-item>
            <el-menu-item index="cargos">Cargos</el-menu-item>
            <el-menu-item index="tipousuarios">Tipo de usuario</el-menu-item>
            <el-menu-item index="clases">Clases</el-menu-item>
            <el-menu-item index="proveedores">Proveedores</el-menu-item>
            <el-menu-item index="productos">Productos</el-menu-item>
          </el-sub-menu>

        </el-menu>
  </template>
  
  <script lang="ts" setup>
  import {Location} from '@element-plus/icons-vue';
  </script>
  
  <style scoped>
  html, body {
    margin: 0;
    padding: 0;
    /* height: 100%; */
  }
  

  
  .el-menu-vertical-demo{
  width: fit-content;
  min-height: 100%;
}
  </style>
  