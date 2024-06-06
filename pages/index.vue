<script setup lang="ts">
import { links } from '~/constants'

const { loggedIn } = useUserSession()
</script>

<template>
  <UContainer :ui="{ base: 'flex relative overflow-hidden' }">
    <div class="py-10 max-w-2xl relative flex flex-col gap-4">
      <h1 class="font-bold text-4xl">
        Welcome to
        <NuxtLink
          to="https://github.com/arashsheyda/todo-real-time"
        >
          Nuxt Todo Real-Time
        </NuxtLink>
      </h1>
      <p>
        A <NuxtLink
          class="text-primary"
          to="https://nuxt.com/"
        >
          Nuxt
        </NuxtLink> demo hosted on
        <NuxtLink
          class="text-primary"
          to="https://vercel.com/"
        >
          Vercel
        </NuxtLink> with real-time updates using
        <NuxtLink
          class="text-primary"
          to="https://nitro.unjs.io/guide/websocket"
        >
          Nitro's WebSocket
        </NuxtLink>.
        <br>
        This demo uses <NuxtLink
          class="text-primary"
          to="https://vitejs.dev/"
        >
          Vite
        </NuxtLink> as the build tool and
        <NuxtLink
          class="text-primary"
          to="https://tailwindcss.com/"
        >
          Tailwind CSS
        </NuxtLink> for styling
        <br>
        and <NuxtLink
          class="text-primary"
          to="https://ui.nuxt.com/"
        >
          Nuxt UI
        </NuxtLink> for customizable UI components.
      </p>
      <div class="flex gap-4 mt-2">
        <UButton
          v-for="item of links.slice(0, 2)"
          :key="item.to"
          v-bind="item"
          variant="outline"
        />
        <UButton
          v-if="!loggedIn"
          to="/api/auth/github"
          icon="i-simple-icons-github"
          label="Login with GitHub"
          color="black"
          external
        />
        <UButton
          v-else
          to="/todos"
          icon="i-ph-check-circle-duotone"
          label="Go to Todos"
        />
      </div>
      <UAlert
        class="mt-2 max-w-lg"
        icon="i-ph-lightbulb-duotone"
        description="This demo does not use a database, so your data is safe and will be lost when the server restarts."
        variant="outline"
        color="violet"
      />
    </div>
  </UContainer>
</template>
