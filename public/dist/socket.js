
const socket = io("http://localhost:4000")
let namespaceSocket;
function stringToHtml(str){
    const parser = new DOMParser()
    const doc = parser.parseFromString(str, "text/html")
    return doc.body.firstChild
}
function initNamespace(endpoint){
    namespaceSocket = io(`http://localhost:4000/${endpoint}`)
    namespaceSocket.on("connect", ()=>{
        namespaceSocket.on("roomList", rooms =>{
            getRoomInfo(endpoint, rooms[0].name)
            const roomElement = document.querySelector("#contacts ul")
            roomElement.innerHTML = ""
            for (const room of rooms) {
                const html = stringToHtml(`
                <li class="contact" roomName="${room.name}">
                    <div class="wrap">
                        <img src="${room.image}" height="40"/>
                        <div class="meta">
                            <p class="name">${room.name}</p>
                            <p class="preview" >${room.description}</p>
                        </div>
                    </div>
                </li>`)
                roomElement.appendChild(html)
            }
            const roomNodes = document.querySelectorAll("ul li.contact")
            for (const room of roomNodes) {
                room.addEventListener("click", ()=>{
                    const roomName = room.getAttribute("roomName")
                    getRoomInfo(endpoint, roomName)
                })   
            }
        })

    })
}

function getRoomInfo(endpoint, roomName){
    document.querySelector("#roomName h3").setAttribute("roomName", roomName)
    document.querySelector("#roomName h3").setAttribute("endpoint", endpoint)
    namespaceSocket.emit("joinRoom", roomName)
    namespaceSocket.on("roomInfo", roomInfo => {
        document.querySelector("#roomName h3").innerText = roomInfo.description
    })
    namespaceSocket.on("onlineUsersCount", count => {
        document.getElementById("onlineCount").innerText = count
    })
}
function sendMessage(){
    const roomName =  document.querySelector("#roomName h3").getAttribute("roomName")
    const endpoint =  document.querySelector("#roomName h3").getAttribute("endpoint")
    let message = document.querySelector(".message-input input#messageInput").value;
    if(message.trim() == "")
        return alert("message cannot be empty")
    namespaceSocket.emit("newMessage", {
        message,
        roomName,
        endpoint 
    })
    namespaceSocket.on("confirmation", data => {
        console.log(data);
    })
    const li = stringToHtml(`
         <li class="sent">
                <img src="http://emilcarlsson.se/assets/harveyspecter.png"
                    alt="" />
                <p>${message}</p>
            </li>
        `)
    document.querySelector(".messages ul").appendChild(li)
    document.querySelector(".message-input input#messageInput").value = ""
    const messageElement = document.querySelector("div.message")
    messageElement.scrollTo(0, messageElement.scrollHeight)
}
socket.on("connect", ()=> {
    socket.on("namespaceList", namespaces => {
        const namespaceElement = document.getElementById("namespaces") 
        namespaceElement.innerHTML = ""
        initNamespace(namespaces[0].endpoint)
        for (const namespace of namespaces) {
            const li = document.createElement("li")
            const p = document.createElement("p")
            p.setAttribute("class", "namespaceTitle")
            p.setAttribute("endpoint", namespace.endpoint)
            p.innerText = namespace.title
            li.appendChild(p)
            namespaceElement.appendChild(li)
        }
        const namespaceNode = document.querySelectorAll("#namespaces li p.namespaceTitle")
        for (const namespace of namespaceNode) {
            namespace.addEventListener("click", ()=>{
                const endpoint = namespace.getAttribute("endpoint")
                initNamespace(endpoint)
            })
        }
    })
    window.addEventListener("keydown", (e) => {
        if(e.code == "Enter"){
            sendMessage()
        }
    })
    document.querySelector("button.submit").addEventListener("click", ()=>{
        sendMessage()
    })
})