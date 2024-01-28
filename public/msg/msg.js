
function removeMsg() {
    const msg = document.querySelector('.msg');
    msg.classList.add('msg-hide');
    setTimeout(() => {
        msg.remove();
    }, 500);
}

setTimeout(() => {
    removeMsg()
}, 4000);