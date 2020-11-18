let username
let socket = io()

do {
    username = prompt('Enter your name:')
} while (!username);

const textarea = document.querySelector('#textarea')

const submitBtn = document.querySelector('#submitBtn')

const commentBox = document.querySelector('.comment_box')

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let comment = textarea.value

    if (!comment) {
        return
    }

    postComment(comment);
});

function postComment(comment) {
    // appending the comment in dom
    let data = {
        username: username,
        comment: comment
    }

    appendToDom(data)
    textarea.value = ''

    // bradcast the data
    broadcastComment(data)

    // sync with db
    syncwithDb(data)

}

function appendToDom(data) {
    let li = document.createElement('li')
    li.classList.add('.comment', '.mb-3')

    let markup = ` <div class="card border-light mb-3">
                        <div class="card-body">
                            <h6>${data.username}</h6>
                            <p>${data.comment}</p>
                            <div>
                                <i class="far fa-clock"></i>
                                <small>${moment(data.time).format('LT')}</small>
                            </div>
                        </div>        
                    </div>`
    li.innerHTML = markup;

    commentBox.prepend(li);
}

function broadcastComment(data) {
    // using socket
    socket.emit('comment', data)
}

socket.on('comment', (data) => {
    appendToDom(data)


})

let timerid = null
function debounce(func, timer) {
 
    if(timerid){
        clearTimeout(timerid)
    }

    timerid=setTimeout(()=>{
    func()
 },timer)
}

let typing = document.querySelector('.typing')
socket.on('typing', (data) => {
    typing.innerText = `${data.username} is typing...`
    debounce(function () {
        typing.innerText = ''
    }, 1000)
})

// event listener on textarea
textarea.addEventListener('keyup', (e) => {
    socket.emit('typing', { username: username })
})

// api calls
function syncwithDb(data) {
    const headers={
        'Content-Type':'application/json'
    }
    fetch('/api/Comments',{method:'Post',body:JSON.stringify(data),headers})
        .then((response)=>response.json()).then((result)=>{
            console.log(result);
        })
}
