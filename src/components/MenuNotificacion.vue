<template>
    <div class="text-center">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        location="end"
      >
        <template v-slot:activator="{ props }">
          <v-col cols="auto">
            <v-btn icon="mdi-bell-outline"  color="indigo" v-bind="props" style="color:black" ></v-btn>
        </v-col>
        </template>
  
        <v-card min-width="300">
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
  
          <v-divider></v-divider>
        </v-card>
      </v-menu>
    </div>
  </template>

<script>
import { mergeProps } from 'vue'

export default {
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
    items: [
        { title: 'Notificacion 1' },
        { title: 'Notificacion 2' },
        { title: 'Notificacion 3' },
        { title: 'Notificacion 4' },
      ],
  }),
  methods: {
      mergeProps,
    },

}
</script>