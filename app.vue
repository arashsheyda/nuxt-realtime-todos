<script setup lang="ts">
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

const card = ref()

const contentHeight = ref(0)

onMounted(() => {
  const header = card.value?.$el.children[0]
  const footer = card.value?.$el.children[2]
  contentHeight.value = card.value?.$el.clientHeight - header.clientHeight - footer.clientHeight
})
</script>

<template>
  <UContainer :ui="{ base: ' ' }">
    <UCard
      ref="card"
      :ui="{
        divide: '',
        body: { padding: '' },
        base: 'min-h-screen m-8',
        header: { base: 'sticky top-0 z-10 flex justify-between items-center gap-10', background: 'bg-white dark:bg-gray-900 border-b border-gray-400/40 rounded-t-lg' },
        footer: { base: 'sticky bottom-0 z-10 flex justify-between items-center gap-10', background: 'backdrop-blur border-b border-gray-400/40 border-t border-gray-400/40 rounded-b-lg' },
      }"
    >
      <template #header>
        <NuxtLink to="/">
          <ClientOnly>
            <template #placeholder>
              <img
                class="w-48"
                src="/logo-light.png"
              >
            </template>
            <img
              class="w-48"
              :src="`/logo-${colorMode.value}.png`"
            >
          </ClientOnly>
        </NuxtLink>
        <div
          id="actions"
          class="w-full"
        />
        <!-- TODO: user drop down -->
      </template>
      <NuxtPage :style="{ 'min-height': `${contentHeight}px` }" />
      <template
        #footer
      >
        <div
          id="footer"
          ref="footer"
          class="w-full"
        />
        <div class="flex gap-4">
          <UButton
            square
            variant="soft"
            color="black"
            :icon="colorMode.preference === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
            @click="toggleColorMode"
          />
        </div>
      </template>
    </UCard>
  </UContainer>
  <UNotifications />
</template>
