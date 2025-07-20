<template>
  <v-container
    class="d-flex flex-column align-center justify-center mt-8 pt-8"
    style="max-width: 500px"
  >
    <v-form
      @submit.prevent="handleSubmit"
      class="w-100 px-16"
    >
      <v-text-field
        label="Nom"
        v-model="form.nom"
        :error-messages="fieldErrors.nom"
        required
        class="mb-4"
      ></v-text-field>
      <v-text-field
        label="Prénom"
        v-model="form.prenom"
        :error-messages="fieldErrors.prenom"
        required
        class="mb-4"
      ></v-text-field>
      <v-text-field
        label="Ville"
        v-model="form.ville"
        :error-messages="fieldErrors.ville"
        required
        class="mb-4"
      ></v-text-field>
      <v-text-field
        label="Adresse email"
        v-model="form.email"
        :error-messages="fieldErrors.email"
        required
        class="mb-4"
      ></v-text-field>
      <v-text-field
        label="Compte Instagram (pseudo ou url)"
        v-model="form.pseudo"
        :error-messages="fieldErrors.pseudo"
        required
        class="mb-4"
      ></v-text-field>

      <p
        v-if="globalError"
        class="text-red mt-4 text-body-1"
      >
        {{ globalError }}
      </p>

      <v-btn
        type="submit"
        color="teal"
        block
        class="mt-2"
        >S'inscrire au jeu</v-btn
      >
    </v-form>

    <v-divider
      class="my-8"
      style="width: 100%"
    ></v-divider>

    <v-btn
      color=" darken-1"
      block
      flat
      @click="connectWithInstagram"
    >
      <v-img
        :src="InstagramIcon"
        width="32"
        class="mr-4"
      />Nous suivre sur Instagram !
    </v-btn>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="success"
    >
      Votre inscription a bien été prise en compte ! Un email de confirmation de
      participation vous a été envoyé.
    </v-snackbar>
  </v-container>
</template>

<script setup>
  import InstagramIcon from "@/assets/images/instagram-icon.png";
  import { z } from "zod";

  const snackbar = ref(false);
  const timeout = ref(5000);

  const form = ref({
    nom: "Mansart",
    prenom: "Esteban",
    ville: "Ferrières-en-Bray",
    email: "esteban.mansart@gmail.com",
    pseudo: "esteban.mansart",
  });
  const fieldErrors = reactive({
    nom: [],
    prenom: [],
    ville: [],
    email: [],
    pseudo: [],
  });

  const globalError = ref("");

  const schema = z.object({
    nom: z.string().min(1, "Nom requis"),
    prenom: z.string().min(1, "Prénom requis"),
    ville: z.string().min(1, "Ville requise"),
    email: z.string().email("Email invalide"),
    pseudo: z.string().min(1, "Compte Instagram requis"),
  });

  Object.keys(form.value).forEach((field) => {
    watch(
      () => form.value[field],
      () => {
        fieldErrors[field] = [];
      }
    );
  });

  const handleSubmit = async () => {
    globalError.value = "";

    const result = schema.safeParse(form.value);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (fieldErrors[path]) {
          fieldErrors[path].push(issue.message);
        }
      });
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/inscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const data = await res.json();
        globalError.value = data?.message || "Erreur serveur";
        return;
      }

      form.value = { nom: "", prenom: "", ville: "", email: "" };
      snackbar.value = true;
    } catch (err) {
      globalError.value = "Impossible de contacter le serveur";
    }
  };

  const connectWithInstagram = () => {
    const instaUrl = "instagram://user?username=chronos7_asso";
    const fallbackUrl = "https://www.instagram.com/chronos7_asso/";

    // Essaie d'ouvrir l'app Insta
    window.location.href = instaUrl;

    // En cas d’échec (sur desktop), redirige après 1s
    setTimeout(() => {
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    }, 1000);
  };
</script>
