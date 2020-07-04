// control admin amount
(function () {
  const switchers = document.querySelectorAll('.authority-switch-user')
  let adminAmount = 0

  switchers.forEach(switcher => adminAmount++)
  if (adminAmount < 2) {
    switchers.forEach(switcher => {
      switcher.setAttribute('disabled', 'true')
    })
  } else if (adminAmount >= 2) {
    switchers.forEach(switcher => {
      switcher.removeAttribute('disabled')
    })
  }
})()

// alert auto dismiss
window.setTimeout(function () {
  $(".alert").alert('close')
}, 3000);