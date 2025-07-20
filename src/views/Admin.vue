<template>
  <v-container
    v-if="!isAuthenticated"
    class="d-flex flex-column align-center justify-center mt-8 pt-8"
    style="max-width: 500px"
  >
    <v-card
      class="pa-6"
      max-width="400"
    >
      <v-card-title class="text-h5 text-center">Connexion</v-card-title>
      <v-divider class="my-4"></v-divider>
      <v-card-text class="text-center">
        <v-btn
          color="teal"
          @click="loginWithGoogle"
        >
          Se connecter avec Google
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
  <template v-else>
    <div class="d-flex flex-column align-center justify-center mt-4">
      <v-btn
        variant="outlined"
        color="red"
        @click="logout"
        >Déconnexion</v-btn
      >
    </div>
    <v-container>
      <v-row>
        <v-col>
          <v-card class="flex-grow-1 mr-4">
            <v-card-title
              >Participants ({{ participants.length }})</v-card-title
            >
            <v-card-text class="text-center">
              <v-btn
                color="warning"
                @click="start"
                >Lancer le tirage au sort !</v-btn
              >
              <v-btn
                color="error"
                class="ml-4"
                @click="reset"
              >
                Réinitialiser
              </v-btn>
            </v-card-text>

            <div
              class="backdrop flex-column align-center justify-center"
              style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.75);
                z-index: 1000;
              "
              :style="{ display: show ? 'flex' : 'none' }"
              @click="
                show = false;
                fireworks?.stop();
              "
            >
              <MagicCard
                ref="magicCard"
                @revealed="addWinner"
              >
                <template
                  #revealed
                  v-if="winner"
                >
                  <v-card-title
                    class="text-h4 text-center"
                    style="text-wrap: wrap"
                    >{{ winner.firstname }} {{ winner.lastname }}</v-card-title
                  >
                  <p
                    v-if="winner.pseudo"
                    style="text-wrap: wrap"
                    class="text-h6 text-grey text-center"
                  >
                    @{{ winner.pseudo }}
                  </p>
                </template>
              </MagicCard>
              <div
                ref="backdrop"
                style="
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;

                  z-index: 1000;
                "
                :style="{ display: show ? 'flex' : 'none' }"
              ></div>
            </div>
            <v-card-text>
              <v-row dense>
                <v-col
                  v-for="(user, index) in filteredParticipants"
                  :key="index"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card class="pa-4">
                    <v-card-title class="text-h6"
                      >{{ user.firstname }} {{ user.lastname }}</v-card-title
                    >
                    <v-card-subtitle
                      v-if="user.pseudo"
                      class="text-caption text-grey"
                    >
                      @{{ user.pseudo }}
                    </v-card-subtitle>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="3">
          <v-card class="">
            <v-card-title>Gagnants ({{ winners.length }})</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(winner, index) in winners"
                  :key="index"
                >
                  <v-list-item-title class="text-h6">
                    {{ winner.firstname }} {{ winner.lastname }}
                  </v-list-item-title>
                  <v-list-item-subtitle
                    v-if="winner.pseudo"
                    class="text-caption text-grey"
                  >
                    @{{ winner.pseudo }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
</template>

<script setup>
  import api from "@/lib/axios";
  import { useAuth } from "@/composables/useAuth";
  import { useRoute } from "vue-router";
  import MagicCard from "./MagicCard.vue";

  import { Fireworks } from "fireworks-js";

  const backdrop = ref(null);

  const route = useRoute();

  const isAuthenticated = ref(false);
  const { logout } = useAuth();

  const setToken = (value) => {
    isAuthenticated.value = true;
    localStorage.setItem("token", value);
    api.defaults.headers.common["Authorization"] = `Bearer ${value}`;
  };

  const participants = ref([]);
  const filteredParticipants = computed(() => {
    return participants.value.filter(
      (p) => !winners.value.some((w) => w.id === p.id)
    );
  });
  const winner = ref(null);
  const winners = ref([]);
  const magicCard = ref(null);
  const show = ref(false);
  const fireworks = ref(null);

  const reset = () => {
    winners.value = [];
    localStorage.removeItem("winners");
  };
  const addWinner = () => {
    fireworks.value?.start();
    if (winner.value) {
      setTimeout(() => {
        winners.value.push(winner.value);
        localStorage.setItem("winners", JSON.stringify(winners.value));
      }, 500);
    }
  };

  const start = () => {
    if (winner.value) {
      winner.value = null;
    }
    // Fisher-Yates shuffle
    show.value = true;
    winner.value =
      participants.value[Math.floor(Math.random() * participants.value.length)];

    setTimeout(() => {
      magicCard.value.start();
    }, 0);
  };

  onMounted(() => {
    const token = route.query.token;
    if (token) {
      setToken(token);
    }

    if (localStorage.getItem("winners")) {
      winners.value = JSON.parse(localStorage.getItem("winners"));
    }

    if (localStorage.getItem("token")) {
      isAuthenticated.value = true;
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
    }

    if (isAuthenticated.value) {
      api
        .get("/admin/entrants")
        .then((response) => {
          participants.value = response.data;
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des participants:",
            error
          );
        });
    }

    setTimeout(() => {
      fireworks.value = new Fireworks(backdrop.value, {
        hue: {
          min: 0,
          max: 30,
        },
        acceleration: 1,
        brightness: {
          min: 50,
          max: 100,
        },
        decay: {
          min: 0.005,
          max: 0.013,
        },
        delay: {
          min: 62.2,
          max: 62.2,
        },
        explosion: 5,
        flickering: 68.48,
        intensity: 28.58,
        friction: 0.99,
        gravity: 2.5,
        opacity: 0.2,
        particles: 200,
        traceLength: 3,
        traceSpeed: 6,
        rocketsPoint: {
          min: 0,
          max: 100,
        },
        lineWidth: {
          explosion: {
            min: 1,
            max: 7,
          },
          trace: {
            min: 0,
            max: 1.3,
          },
        },
        lineStyle: "round",
      });
    }, 0);
  });

  const loginWithGoogle = () => {
    const redirectUrl =
      import.meta.env.VITE_API_URL + import.meta.env.VITE_OAUTH_ENDPOINT;
    if (!redirectUrl) {
      console.error("❌ OAUTH_ENDPOINT manquant dans le .env");
      return;
    }

    window.location.href = redirectUrl;
  };
</script>

<style scoped>
  .shuffle-move {
    transition: transform 0.4s ease, opacity 0.4s ease;
  }
  .shuffle-enter-active,
  .shuffle-leave-active {
    transition: all 0.4s ease;
  }
  .shuffle-enter-from,
  .shuffle-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }
</style>
