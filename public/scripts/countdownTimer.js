function timer() {
    const countdown = new Date().getTime() + 1000 * 60 * 5;
    const x = setInterval(() => {
        let currentTime = new Date().getTime();
        let distance = countdown - currentTime;

        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.querySelector('#timer').innerText = `${minutes}:${seconds}`;

        if (distance < 0) {
            clearInterval(x);
            document.querySelector('#timer').innerText = `Expired`;
        }
    }, 1000);
}

timer();
