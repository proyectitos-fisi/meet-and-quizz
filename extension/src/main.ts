import { ElementChangeEvent, listenForChanges, waitForAvailable } from './element_available'

// @ts-ignore
const $ = (...args: any[]) => document.querySelector.apply(document, args) as HTMLElement
const CHAT_CONTAINER_SELECTOR = 'div.z38b6'

const MESSAGE_BOX_CLASS = 'div.Ss4fHf'

const MESSAGE_USER_CLASS = 'poVWob' // means new message from user
const MESSAGE_TIMESTAMP_CLASS = 'MuzmKe'
const MESSAGE_TEXT_CLASS = 'er6Kjc'

const recordingBox = document.createElement('div')
recordingBox.className = 'mquizz recording-box'
recordingBox.textContent = 'Waiting for chat to open...'
document.body.appendChild(recordingBox)

let currentUserMessaging = {
  name: '<unknown>',
  time: '00:00 AM'
}

/**
 * Executed whenever a chat message element is added. A chat element may be interpreted as
 * a 'chat fragment'. It may be just the user name, the message text, or the timestamp, or the
 * whole message box itself.
 */
function onChatElementAdded(chatElement: HTMLElement) {
  if (chatElement.className.includes(MESSAGE_USER_CLASS)) {
    currentUserMessaging.name = chatElement.textContent || '<unknown>'
    return
  }
  if (chatElement.className.includes(MESSAGE_TIMESTAMP_CLASS)) {
    currentUserMessaging.time = chatElement.textContent || '00:00 AM'
    return
  }
  if (chatElement.className.includes(MESSAGE_TEXT_CLASS)) {
    console.log(
      `[${currentUserMessaging.time}] ${currentUserMessaging.name}: ${chatElement.textContent}`
    )
  }
}

let isChatListening = false
let disconnectListening = () => {}

window.addEventListener('load', () => {
  waitForAvailable(CHAT_CONTAINER_SELECTOR, (event) => {
    isChatListening = event.type === 'available'

    recordingBox.classList.toggle('connected', isChatListening)
    recordingBox.textContent = isChatListening ? 'Listening messages' : 'Waiting for chat to open...'

    if (event.type === 'available') {
      const chat = event.target
      console.log('Listening for messages...')
      disconnectListening = listenForChanges(chat, (ev) => onChatElementAdded(ev.target), { added: true, removed: false })
    }
    if (event.type === 'unavailable') {
      console.log('Unable to listen for messages...')
      disconnectListening()
    }
  })
})
