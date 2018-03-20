/**
* Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks () {
  document.addEventListener('click', (e) => {
    /**
     * Send a "scramble" message to the content script in the active tab.
     */
    function scramble (tabs) {
      for (var tab in tabs) {
        if (tabs.hasOwnProperty(tab)) {
          browser.tabs.sendMessage(tabs[tab].id, {
            command: 'scramble'
          })
        }
      }
    }

    /**
    * Send a "reset" message to the content script in the active tab.
    */
    function reset (tabs) {
      for (var tab in tabs) {
        if (tabs.hasOwnProperty(tab)) {
          browser.tabs.sendMessage(tabs[tab].id, {
            command: 'reset'
          })
        }
      }
    }

    /**
    * Just log the error to the console.
    */
    function reportError (error) {
      console.error(`Could not scramble: ${error}`)
    }

    /**
    * Call "scramble()" or "reset()" as appropriate.
    */
    if (e.target.classList.contains('scramble')) {
      browser.tabs.query({ active: true })
        .then(scramble)
        .catch(reportError)
    } else if (e.target.classList.contains('reset')) {
      browser.tabs.query({ active: true })
        .then(reset)
        .catch(reportError)
    }
  })
}

/**
* There was an error executing the script.
* Display the popup's error message, and hide the normal UI.
*/
function reportExecuteScriptError (error) {
  document.querySelector('#popup-content').classList.add('hidden')
  document.querySelector('#error-content').classList.remove('hidden')
  console.error(`Failed to execute scramble content script: ${error.message}`)
}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs.executeScript({file: '/scramble.js'})
  .then(listenForClicks)
  .catch(reportExecuteScriptError)
