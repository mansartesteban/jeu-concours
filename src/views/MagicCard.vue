<template>
  <div
    class="magic-card"
    style="text-wrap: auto"
  >
    <div class="front d-flex flex-column justify-center align-center">
      <template v-if="!reveal">
        <slot name="front">FRONT</slot>
      </template>
      <template v-else>
        <slot name="revealed">REVEALED</slot>
      </template>
    </div>
    <div class="back d-flex flex-column justify-center align-center">
      <slot name="back">
        <img
          src="@/assets/images/chronos7-icon.png"
          alt="Chronos7 Icon"
          width="300"
        />
      </slot>
    </div>
  </div>
</template>

<script setup>
  const emit = defineEmits(["revealed"]);
  const reveal = ref(false);

  defineExpose({
    start() {
      reveal.value = false;
      document.querySelector(".magic-card").classList.add("start");
      setTimeout(() => {
        reveal.value = true;
        emit("revealed");
      }, 9500);

      document
        .querySelector(".magic-card")
        .addEventListener("transitionend", () => {
          document.querySelector(".magic-card").classList.remove("start");
        });
    },
  });
</script>

<style scoped>
  .magic-card {
    z-index: 10000;
    height: 500px;
    width: 300px;
    position: relative;
    transform-style: preserve-3d;
    transform: rotateY(0);
  }
  .magic-card.start {
    transition: transform 12000ms;
  }

  .magic-card.start {
    transform: rotateY(3600deg);
  }

  .front,
  .back {
    height: 100%;
    width: 100%;
    border-radius: 2rem;
    box-shadow: 0 0 5px 2px rgba(50, 50, 50, 0.25);
    position: absolute;
    backface-visibility: hidden;
  }

  .front {
    background-color: rgb(255, 255, 255);
  }

  .back {
    background-color: #2a2a2a;
    transform: rotateY(180deg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5rem;
  }
</style>
