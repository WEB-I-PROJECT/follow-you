
function removeMsg() {
    const msg = document.querySelector('.msg');
    if (msg) {
        msg.classList.add('msg-hide');
        setTimeout(() => {
            msg.remove();
        }, 490);
    }  
}

setTimeout(() => {
    removeMsg()
}, 7000);