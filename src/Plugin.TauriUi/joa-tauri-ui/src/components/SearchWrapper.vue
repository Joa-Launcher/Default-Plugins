<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
import {register, unregisterAll} from "@tauri-apps/api/globalShortcut";
import {showWindow} from "../main";
import Search from "./Search.vue";
import {getConnection} from "../connectionHolder";

const isConnected = ref(false);


onMounted( async() => {
  try {
    await getConnection().start();
    console.log("finished starting connection")
    isConnected.value = true;
    getConnection().onreconnected(() => {
      isConnected.value = true;
    });

    getConnection().onclose(() => {
      isConnected.value = false;
    });

    getConnection().onreconnecting(() => {
      isConnected.value = false;
    });

    await unregisterAll();
    await register("Alt+P", async () => {
      await showWindow();
    });
  }catch (e) {

  }
});

onUnmounted(async () => {
  await getConnection().stop();
  await unregisterAll();
});

</script>
<template>
  <Search v-if="isConnected"></Search>
</template>
