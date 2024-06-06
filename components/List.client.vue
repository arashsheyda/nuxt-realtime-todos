<script setup lang="ts">
import { useWebSocket, useDateFormat } from '@vueuse/core'
import type { Todo } from '~/types'

const { user } = useUserSession()

const { data, send, status } = useWebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location?.host}/api/ws?userId=${user.value?.login}`)

const newTodo = ref('')
const todos = ref<Todo[]>([])
const users = ref<any[]>([])

const isOpen = ref(false)
const input = ref()

watch(data, (newData) => {
  const { type, payload, users: uList } = JSON.parse(newData)

  if (uList) {
    users.value = uList
  }

  if (type === 'list') {
    todos.value = payload
  }
  else if (type === 'users') {
    users.value = payload
  }
})

function add() {
  if (!newTodo.value) return

  // generate unique id and check if it already exists
  let id = uniqueId()
  while (todos.value.find(item => item.id === id)) {
    id = uniqueId()
  }

  const payload = { user: { id: user.value?.login }, id, item: newTodo.value, done: false, createdAt: new Date() }
  todos.value.push(payload)
  send(JSON.stringify({ type: 'add', payload }))
  newTodo.value = ''
  input.value?.input.focus()
}

function edit(id: number) {
  const index = todos.value.findIndex(item => item.id === id)
  const todo = todos.value[index]

  if (todo.user.id !== user.value!.login) return

  const newItem = prompt('Edit the todo:', todo.item)
  if (!newItem) return

  todo.item = newItem
  send(JSON.stringify({ type: 'edit', payload: todo }))
}

function toggle(id: number) {
  const index = todos.value.findIndex(item => item.id === id)
  const todo = todos.value[index]

  if (todo.user.id !== user.value!.login) return

  todo.done = !todo.done
  send(JSON.stringify({ type: 'edit', payload: todo }))
}

function remove(id: number) {
  const index = todos.value.findIndex(item => item.id === id)
  const item = todos.value[index]

  if (item.user.id !== user.value!.login) return

  todos.value.splice(index, 1)
  send(JSON.stringify({ type: 'remove', payload: item.id }))
}

function uniqueId() {
  return Math.floor(10000000 + Math.random() * 90000000)
}
</script>

<template>
  <USlideover v-model="isOpen">
    <template #title>
      <h2 class="text-xl font-bold">
        Users
      </h2>
    </template>
    <ul class="flex flex-col gap-4 p-4 rounded-xl">
      <template v-if="users.length === 0">
        <div
          v-for="i of 8"
          :key="i"
          class="flex items-center space-x-4"
        >
          <USkeleton
            class="h-9 w-9"
            :ui="{ rounded: 'rounded-full', background: 'bg-gray-100 dark:bg-gray-700' }"
          />
          <div class="space-y-2">
            <USkeleton
              class="h-4 w-[250px]"
              :ui="{ background: 'bg-gray-100 dark:bg-gray-700' }"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <NuxtLink
          v-for="u in users"
          :key="u.id"
          :to="`https://github.com/${u.id}`"
          target="_blank"
          class="flex items-center gap-2"
        >
          <UAvatar
            class="w-10 h-10"
            :src="`https://avatars.githubusercontent.com/${u.id}`"
          />
          <span>{{ u.id }}</span>
          <UBadge
            :color="u.online ? 'green' : 'red'"
            :variant="u.online ? 'solid' : 'subtle'"
          >
            {{ u.online ? 'online' : 'offline' }}
          </UBadge>
        </NuxtLink>
      </template>
    </ul>
  </USlideover>
  <ul class="flex flex-col gap-4 p-4 rounded-xl">
    <template v-if="status !== 'OPEN'">
      <div
        v-for="i of 20"
        :key="i"
        class="flex items-center space-x-4"
      >
        <USkeleton
          class="h-9 w-9"
          :ui="{ rounded: 'rounded-full', background: 'bg-gray-100 dark:bg-gray-700' }"
        />
        <div class="space-y-2">
          <USkeleton
            class="h-4 w-[250px]"
            :ui="{ background: 'bg-gray-100 dark:bg-gray-700' }"
          />
        </div>
      </div>
    </template>
    <template v-else-if="status === 'OPEN'">
      <li
        v-for="item in todos"
        :key="item.id"
        class="group flex items-center gap-2 border border-neutral-400/40 p-2 rounded-lg"
        :class="[
          item.user.id === user!.login ? 'hover:border-primary' : 'hover:border-blue-400',
          { '!border-cyan-400': item.done },
        ]"
      >
        <UAvatar
          size="md"
          :class="{ grayscale: item.done }"
          :src="`https://avatars.githubusercontent.com/${item.user.id}`"
        />
        <span :class="{ 'line-through': item.done }">{{ item.item }}</span>
        <div class="flex-auto" />
        <div
          v-if="item.user.id === user!.login"
          class="flex items-center gap-6 mr-4"
        >
          <UButton
            icon="i-ph-trash"
            color="red"
            variant="soft"
            class="opacity-0 group-hover:opacity-100 transition-all"
            @click="remove(item.id)"
          />
          <UButton
            icon="i-ph-pen-duotone"
            color="blue"
            variant="soft"
            class="opacity-0 group-hover:opacity-100 transition-all"
            @click="edit(item.id)"
          />
          <UToggle
            :model-value="item.done"
            color="cyan"
            @click="toggle(item.id)"
          />
          <UTooltip :text="`Created at ${useDateFormat(item.createdAt, 'YYYY-MM-DD HH:mm:ss').value}`">
            <UIcon name="i-ph-clock-duotone" />
          </UTooltip>
        </div>
      </li>
      <li
        v-if="todos.length === 0"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-3xl font-bold flex flex-col items-center gap-2"
      >
        <Icon
          name="i-ph-file-duotone"
          class="text-5xl"
        />
        No todos yet, start adding!
      </li>
    </template>
  </ul>
  <Teleport to="#actions">
    <UProgress v-if="status !== 'OPEN'" />
    <div
      v-else
      class="flex items-center gap-2"
    >
      <UInput
        ref="input"
        v-model="newTodo"
        placeholder="What needs to be done?"
        class="w-full"
        @keydown.enter="add"
      />
      <UButton
        icon="i-ph-plus"
        color="primary"
        @click="add"
      />
    </div>
  </Teleport>
  <Teleport to="#footer">
    <UProgress v-if="status !== 'OPEN'" />
    <div
      v-else
      class="flex items-center gap-8"
    >
      <UTooltip :text="`${users?.filter((u) => u.online).length} users are online out of ${users.length} users!`">
        <UButton
          variant="ghost"
          color="gray"
          icon="i-ph-users-duotone"
          @click="isOpen = !isOpen"
        >
          users:
          <UKbd>{{ users.filter((u) => u.online).length }}</UKbd>
          /
          <UKbd>{{ users.length }}</UKbd>
        </UButton>
      </UTooltip>
      <UTooltip :text="`${todos.filter((item) => item.done).length} TODO out of ${todos.length} TODOs has been done!`">
        <UButton
          variant="ghost"
          color="gray"
          icon="i-ph-check-circle"
        >
          todos:
          <UKbd>{{ todos.filter((item) => item.done).length }}</UKbd>
          /
          <UKbd>{{ todos.length }}</UKbd>
        </UButton>
      </UTooltip>
    </div>
  </Teleport>
</template>
