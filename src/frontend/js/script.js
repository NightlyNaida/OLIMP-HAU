let form = document.querySelector(`#image-send-form`);

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await fetch('/',{
        method: 'POST',
        body: new FormData(form)
    }).then(response => console.log(response)).catch(err => console.log(err));
})
