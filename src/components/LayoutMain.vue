<script setup>
import NavBar from './NavBar.vue';
import SideBarMenu from './SideBarMenu.vue';
</script>

<template>
  <el-container style="height: 100vh;">
    <el-header>
      <NavBar />
    </el-header>
    
    <el-container>
      <el-aside width="auto">
        <SideBarMenu />
      </el-aside>

      <el-main class="main-content">
        <slot name="slotLayout"></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-header {
  padding: 0;
}

.el-aside {
  background-color: #f4f4f4;
}

.main-content {
  position: relative;
}
</style>
