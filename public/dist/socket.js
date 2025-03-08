const socket = io("http://localhost:4000")
function stringToHtml(str){
    const parser = new DOMParser()
    const doc = parser.parseFromString(str, "text/html")
    return doc.body.firstChild
}
function initNamespace(endpoint){
    const socket = io(`http://localhost:4000/${endpoint}`)
    socket.on("connect", ()=>{
        socket.on("roomList", rooms =>{
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
        })

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