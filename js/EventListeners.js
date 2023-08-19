window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // --- MOvement
        case 'w':
        case 'W':
        case 'ArrowUp':
            if (player.isGrounded) {
                player.velocity.y = JUMP_FORCE
                player.isGrounded = false;
            }
            KEYS.w.pressed = true
            player.lastKey = 'w'
            break
        case 'd':
        case 'D':
        case 'ArrowRight':
            player.lastKey = 'd'
            KEYS.d.pressed = true
            break
        case 'a':
        case 'A':
        case 'ArrowLeft':
            player.lastKey = 'a'
            KEYS.a.pressed = true
            break
        // ---  Attack
        case ' ':

            break
    }

})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
            KEYS.w.pressed = false
            break
        case 'd':
        case 'D':
        case 'ArrowRight':
            KEYS.d.pressed = false
            break
        case 'a':
        case 'A':
        case 'ArrowLeft':
            KEYS.a.pressed = false
            break
    }
})
