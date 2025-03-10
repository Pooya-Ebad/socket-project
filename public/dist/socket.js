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
            getRoomInfo(rooms[0].name)
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
                    getRoomInfo(roomName)
                })   
            }
        })

    })
}

function getRoomInfo(roomName){
    namespaceSocket.emit("joinRoom", roomName)
    namespaceSocket.on("roomInfo", roomInfo => {
        document.querySelector("#roomName h3").innerText = roomInfo.description
    })
    namespaceSocket.on("onlineUsersCount", count => {
        document.getElementById("onlineCount").innerText = count
    })
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
})