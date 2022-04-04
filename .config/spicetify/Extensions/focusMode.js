(function FocusMode() {
  const topBar = document.querySelector(".main-topBar-historyButtons");

  if (!Spicetify.Player || !Spicetify.Player.data || !topBar) {
    setTimeout(FocusMode, 200)
    return
  }

  const classes =
      [
        // "main-navBar-navBar", 
        "Root__nav-bar",
        "main-buddyFeed-buddyFeedRoot",
      ]

      let elements = []

  for (var i = 0; i < classes.length; i++) {
    elements.push(document.getElementsByClassName(classes[i]))
    // elements.push(document.querySelector(classes[i]))
  }

  console.log(elements)

  function activate() {
    elements.forEach((e) => {
      if (e[0])
        e[0].style.display = "none"
    })
    // elements.forEach(e => console.log(e))
    document.body.classList.add("focusmode-activated")
  }

  function deactivate() {
    elements.forEach((e) => {
      if (e[0])
        e[0].style.display = "flex"
    })
    document.body.classList.remove("focusmode-activated")
  }

  // Add activator on top bar
  const button = document.createElement("button")
  button.classList.add("main-topBar-button", "fad-button")
  button.setAttribute("title", "Focus")
  button.innerHTML =
      `<svg role="img" height="16" width="16" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 5v8c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V5h10m4-2H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm-2 5V5h2v3h-2zm2 11H2v2h18v-2z"/></svg>`

  topBar.append(button)

  function toggleFocusMode() {
    console.log("Button click!!")

    if (document.body.classList.contains('focusmode-activated')) {
      deactivate();
    }
    else {
      activate();
    }
  }

  button.onclick = toggleFocusMode

  // TODO: consider adding keyboard shortcut
  // Spicetify.Keyboard.registerShortcut(
  //     {
  //         key: Spicetify.Keyboard.KEYS["F10"],
  //         ctrl: false,
  //         shift: false,
  //         alt: false,
  //     },
  //     toggleFocusMode
  // );
})()
