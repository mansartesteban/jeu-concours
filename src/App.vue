<template>
  <v-app>
    <v-app-bar color="teal">
      <template v-slot:prepend>
        <v-img
          :src="Chronos7Icon"
          width="48"
          class="ml-2"
        ></v-img>
      </template>
      <v-app-bar-title>Chronos7 - Jeu concours</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
  import Chronos7Icon from "@/assets/images/chronos7-icon.png";
</script>
