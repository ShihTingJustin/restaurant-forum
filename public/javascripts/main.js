// control admin amount
(function () {
  const switchers = document.querySelectorAll('.authority-switch-user')
  let adminAmount = 0
  switchers.forEach(switcher => {
    adminAmount++
  })
  if (adminAmount < 2) {
    switchers.forEach(switcher => {
      switcher.classList.add('d-none')
    })
  } else if (adminAmount >= 2) {
    switchers.forEach(switcher => {
      switcher.classList.remove('d-none')
    })
  }
})()

// alert auto dismiss
window.setTimeout(function () {
  $(".alert").alert('close')
}, 3000);