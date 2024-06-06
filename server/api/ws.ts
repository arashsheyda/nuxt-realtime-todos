import type { Peer } from 'crossws'
import { getQuery } from 'ufo'
import type { Todo } from '~/types'

const room = 'todo'

let todos: Todo[] = []

const users: { id: string, online: boolean }[] = []

export default defineWebSocketHandler({
  open(peer) {
    const userId = getUserId(peer)
    const user = users.find(user => user.id === userId)

    if (!user) {
      users.push({ id: userId, online: true })
    }
    if (user) {
      user.online = true
    }

    peer.subscribe(room)
    peer.send({ type: 'list', payload: todos, users })
    peer.publish(room, { type: 'users', payload: users })
  },

  message(peer, message) {
    const { type, payload } = JSON.parse(message.text())

    if (type === 'add') {
      todos.push(payload)
    }
    else if (type === 'toggle') {
      const todo = todos.find(todo => todo.id === payload)
      if (todo) {
        todo.done = !todo.done
      }
    }
    else if (type === 'edit') {
      // payload is the item
      const todo = todos.find(todo => todo.id === payload.id)
      if (todo) {
        todo.item = payload.item
        todo.done = payload.done
      }
    }
    else if (type === 'remove') {
      todos = todos.filter(todo => todo.id !== payload)
    }

    peer.publish(room, { type: 'list', payload: todos })
  },

  close(peer, details) {
    const userId = getUserId(peer)
    const user = users.find(user => user.id === userId)
    if (user) {
      user.online = false
    }

    peer.unsubscribe(room)
    peer.publish(room, { type: 'users', payload: users }) // Broadcast the updated user list
  },

  error(peer, error) {
    console.log('[ws] error', peer, error)
  },
})

function getUserId(peer: Peer) {
  const query = getQuery(peer.url)
  return query.userId as string
}
