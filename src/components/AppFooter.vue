<template>
  <v-footer
    tile
    height="80"
    class="font-weight-medium shadow-sm rounded-lg ma-4"
    :color="$vuetify.theme.dark ? 'dark' : 'white'"
    :dark="$vuetify.theme.dark"
    :inset="true"
  >
    <v-col class="text-left" cols="12">
      <div class="d-flex flex-row justify-space-between align-center">
        <div>
          <strong class="text--disabled">
            SISGEM 🍖
          </strong>
        </div>
        <div>
          <strong class="text--disabled">
            © Copyrigth {{ new Date().getFullYear() }}-{{
              new Date().getFullYear() + 1
            }}
          </strong>
        </div>
      </div>
    </v-col>
  </v-footer>
</template>

<script>

export default {
};
</script>
<style lang="scss" scoped>
.app--footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
