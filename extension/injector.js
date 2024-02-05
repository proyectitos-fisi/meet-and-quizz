const script = document.createElement('script')

script.src = chrome.runtime.getURL('dist/main.js')
script.type = 'text/javascript'
script.async = true

;(document.head || document.documentElement).appendChild(script)
