const socket = io("http://localhost:4000")
socket.on("connect", ()=> {
    socket.on("namespaceList", data => {
        const namespaceElement = document.getElementById("namespaces") 
        namespaceElement.innerHTML = ""
        for (const element of data) {
            const li = document.createElement("li")
            const p = document.createElement("p")
            p.innerText = element.title
            li.appendChild(p)
            namespaceElement.appendChild(li)
        }
    })
})