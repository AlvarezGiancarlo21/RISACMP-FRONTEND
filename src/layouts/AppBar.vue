<template>
  <div>
    <v-sheet class="header-backup"></v-sheet>
    <v-app-bar
      app
      color="white"
      class="px-sm text-left shadow-sm ma-4 rounded-lg"
      flat
      height="75"
    >
      <v-app-bar-nav-icon
          v-ripple="{ class: 'primary--text' }"
          @click="toggleVerticalSidebarDrawer"
      />
      <v-toolbar-title style="font-weight:400; color: #757575">SISGEM</v-toolbar-title>
      <v-spacer />
      <v-badge
        bordered
        overlap
        :value="PendingNotifications"
        :content="PendingNotifications"
        color="red"
        offset-x="22"
        offset-y="22"
      >
        <v-btn icon @click="notificationDrawer = !notificationDrawer">
          <v-icon>mdi-bell</v-icon>
        </v-btn>
      </v-badge>

      <v-btn icon @click="searchDrawer = !searchDrawer">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-chip
        pill
        class="transparent rounded-pill py-6"
        @click="userDrawer = !userDrawer"
      >
        Hola, Estimado
        <v-avatar class="ml-2">
          <v-img src="@/assets/images/usuario-de-perfil-grey.png"></v-img>
        </v-avatar>
      </v-chip>
    </v-app-bar>
    <!-- notificationDrawer  -->
    <v-navigation-drawer
      v-model="notificationDrawer"
      fixed
      right
      height="100%"
      temporary
      floating
      width="350"
    >
      <notification-drawer :notificaciones="notificaciones">
        <template v-slot:notificationDrawerCloseButton>
          <v-btn
            icon
            color
            @click.stop="notificationDrawer = !notificationDrawer"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </notification-drawer>

      <template v-slot:append>
        <div class="my-4 mx-4">
          <base-hover-button
            text="Ver todas las notificaciones"
            block
            bg-color="bg-blue-200"
          />
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";

export default {
  name: "DashboardAppBar",
  components:{
    NotificationDrawer: () => import("./NotificationDrawer.vue"),
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    cont: 29060050,
    notificaciones: [],
    notificacionesPendientes: 0,
    userDrawer: false,
    notificationDrawer: false,
    searchDrawer: false,
    navbarOptions: {
      elementId: "main-navbar",
      isUsingVueRouter: true,
      mobileBreakpoint: 992,
      brandImagePath: "./",
      brandImageAltText: "brand-image",
      collapseButtonOpenColor: "#661c23",
      collapseButtonCloseColor: "#661c23",
      showBrandImageInMobilePopup: true,
      ariaLabelMainNav: "Main Navigation",
      tooltipAnimationType: "shift-away",
    }
  }),
  async created() {
    await this.ObtenerNotificaciones();
    // Listen to question hub coming from SignalR events
    this.$notificationHub.$on("notification-added", this.onNotificationAdded);
  },
  methods: {
    ...mapActions([
      "changeVerticalSidebarDrawer"
    ]),
    async ObtenerNotificaciones() {
      const requestParams = new URLSearchParams();
      requestParams.append('usuarioReceptor', true);
      await axios
        .get("/Notificaciones/GetNotifByUsuario", { params: requestParams } )
        .then((res) => {
          console.log(res.data);
          const listNotificaciones = res.data;
          this.notificaciones = listNotificaciones;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    onNotificationAdded(idUsuario, notification) {
      if(idUsuario == this.user.infoUser.id){
        this.notificaciones = [notification, ...this.notificaciones];
      }
    },
    beforeDestroy() {
      // Make sure to cleanup SignalR event handlers when removing the component
      this.$notificationHub.$off("notification-added", this.onQuestionAdded);
    },
    toggleVerticalSidebarDrawer() {
      this.changeVerticalSidebarDrawer();
    },
    async LlenarNotifTemp(){
      const bodyRequest = {
        titulo: `Prueba ${this.cont}`,
        cuerpo: `Cuerpo de prueba ${this.cont}`,
        usuario_emisor: {
          id: "624bb82fb18676fb0af16331",
          nombre: "Augusto Gutierrez Llanos"
        },
        usuarios_receptores: [{
          id: "624bb7f5b18676fb0af1632c",
          nombre: "William Martel Quiroz"
        },
          {
          id: "624bb82fb18676fb0af16331",
          nombre: "Augusto Gutierrez Llanos"
        }
        ],
        url_bandeja: "https://www.facebook.com/",
        url_formulario: "https://www.facebook.com/",
        url_sistema: "https://www.facebook.com/",
        icono_info:{
          nombre_icono: "mdi-file-document",
          class_icono: "bg-blue-200 info--text",
        }
      }
      this.cont++;
      console.log("antes de enviar la notificacion")
      await axios
        .post("/Notificaciones/SendNotificacion", bodyRequest )
        .then((res) => {
          this.$notificationHub.sendNotification("users_logged", res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  computed:{
    ...mapGetters("Authentication",['user']),
    PendingNotifications(){
      const notificaciones = this.notificaciones;
      return notificaciones.filter(notificacion => notificacion.estado.codigo == "sin_leer").length
    }
  }
};
</script>
<style lang="scss">
.header-backup {
  display: block;
  width: 100%;
  height: 102px;
  position: fixed;
  top: 0;
  z-index: 5;
  background: linear-gradient(
    180deg,
    hsla(0, 0%, 97.3%, 0.95) 44%,
    hsla(0, 0%, 97.3%, 0.46) 73%,
    hsla(0, 0%, 100%, 0)
  ) !important;
  left: 0;
  &.theme--dark {
    background: linear-gradient(
      180deg,
      rgba(5, 5, 5, 0.95) 44%,
      rgba(0, 0, 0, 0.46) 3%,
      hsla(0, 0%, 100%, 0)
    ) !important;
  }
}
.tippy-box[data-theme~="light"] {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.vnb {
  background: transparent !important;
  &__menu-options {
    margin-top: 3px !important;
    &__option {
      &__link {
        &:focus {
          outline: none;
          border: 1px solid none;
        }
        &:hover {
          color: #0081ff;
          .vnb__menu-options__option__arrow {
            fill: #0081ff;
          }
        }

        &__icon {
          svg {
            fill: #0081ff !important;
          }
        }
      }
    }
  }

  &__sub-menu-options {
    &__option {
      &__link {
        &:focus {
          outline: none;
          border: 1px solid none;
        }
        color: #000 !important;
        &:hover {
          color: #0081ff !important;
        }
      }
    }
  }
}

.vnb__collapse-button {
  &:focus {
    border: 1px solid none;
    outline: none;
  }
  &:after {
    content: "\F035C";
    font-size: 25px;
    font-weight: 600;
    font-family: "Material Design Icons";
  }
  svg {
    display: none !important;
  }
}

.vnb__popup {
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: scroll !important;
  .vnb__popup__top__close-button {
    &:focus {
      border: 1px solid none;
      outline: none;
    }
    top: 20px;
    right: -33px;
    svg {
      fill: #000 !important;
    }
  }
}
</style>
