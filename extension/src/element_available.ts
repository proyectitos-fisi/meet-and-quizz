export type ElementChangeEvent = {
  type: 'added' | 'removed'
  target: HTMLElement
}

type ElementChangeCallback = (event: ElementChangeEvent) => void

type ChangeEventOptions = {
  added?: boolean,
  removed?: boolean,
}

export function listenForChanges(
  target: HTMLElement,
  callback: ElementChangeCallback,
  options: ChangeEventOptions = { added: true, removed: true },
): () => void {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (options.added === true || options.added === undefined) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const element = mutation.addedNodes[i]
          if (!(element instanceof HTMLElement)) {
            continue
          }
          callback({ type: 'added', target: element })
        }
      }
      if (options.removed === true || options.removed === undefined) {
        for (let i = 0; i < mutation.removedNodes.length; i++) {
          const element = mutation.removedNodes[i]
          if (!(element instanceof HTMLElement)) {
            continue
          }
          callback({ type: 'removed', target: element })
        }
      }
    })
  })

  observer.observe(target, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  })

  return observer.disconnect.bind(observer)
}

type AvailabilityChangeEvent = {
  type: 'available'
  target: HTMLElement
} | {
  type: 'unavailable'
  target: null
}

type AvailabilityChangeCallback = (event: AvailabilityChangeEvent) => void

export function waitForAvailable(
  selector: string,
  callback: AvailabilityChangeCallback,
  parent: HTMLElement = document.body,
): () => void {
  const target = parent.querySelector(selector)
  if (target && target instanceof HTMLElement) {
    callback({ type: 'available', target })
  }
  let onceAvailable = false

  return listenForChanges(parent, (event) => {
    const element = parent.querySelector(selector)

    if (element && !onceAvailable) {
      callback({ type: 'available', target: element as HTMLElement })
      onceAvailable = true
    }
    if (element === null && onceAvailable) {
      callback({ type: 'unavailable', target: null })
      onceAvailable = false
    }
  }, { added: true, removed: true })
}
