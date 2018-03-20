(function () {
  var RESET_TIMEOUT = 1 * 60 * 1000
  var scrambleTimer = null
  var resetTimer = null

  var moved = false // true if mouse have moved since timeout started.
  var scrambled = false // true if we should be scrambled.
  var timedOut = false

  document.addEventListener('mousemove', function () {
    moved = true

    // console.log(timeout + " " + scrambled);
    if (timedOut && !scrambled) {
      reset()
    }
  }, false)

  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return
  }
  window.hasRun = true

  var encrypt = function (s) {
    return s.replace(/[a-zA-Z]/g, function (c) {
      return Math.random().toString(36).replace(/[^a-z]+/g, '').charAt(0)
    })
  }

  function getWalker () {
    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    )

    return walker
  }

  function scrambleTimerTick () {
    scrambleTimer = null
    scramble()
  }

  function scramble () {
    // console.log("Scramble");

    var walker = getWalker()

    var node
    while ((node = walker.nextNode())) {
      if (!node._scrambled) {
        node._scrambled_text = node.nodeValue

        node.nodeValue = encrypt(node.nodeValue)
        node._scrambled = true
      }
    }

    if (scrambleTimer == null) {
      // Keep scrambling in case page dynamically changes while we are scrambled.
      scrambleTimer = setTimeout(scrambleTimerTick, 1000)
    }
  }

  function reset () {
    // console.log("Reset");

    if (scrambleTimer) {
      clearTimeout(scrambleTimer)
      scrambleTimer = null
    }

    var walker = getWalker()

    var node
    while ((node = walker.nextNode())) {
      if (node._scrambled) {
        node.nodeValue = node._scrambled_text
        delete node._scrambled
      }
    }

    timedOut = false
    startResetTimer()
  }

  function resetTimerTick () {
    // console.log("Reset timer tick");
    resetTimer = null

    if (!moved || !scrambled) {
      timedOut = true
      scramble()
    } else {
      startResetTimer()
    }
  }

  function startResetTimer () {
    if (resetTimer) {
      clearTimeout(resetTimer)
    }

    moved = false
    resetTimer = setTimeout(resetTimerTick, RESET_TIMEOUT)
  }

  startResetTimer()

  /**
     * Listen for messages from the background script.
     * Call "scramble()" or "reset()".
     */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'scramble' && !scrambled) {
      scrambled = true
      scramble()
    } else if (message.command === 'reset') {
      scrambled = false
      reset()
    }
  })
})()
