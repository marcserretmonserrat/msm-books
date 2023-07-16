const checkIsNavigationSupported =() => {
    return Boolean(document.startViewTransition)
}

const fetchPage = async (url) =>{
    //vamos a cargar la pagina de destino
    //utilizando un fetch para obtener el html de destino.
    const response = await fetch(url)
    //const json = await response.json()
    const text = await response.text()
    //quedarnos solo con el contenido del html dentro de la etiqueta body.
    const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)	
    return data
}

export const startViewTransition = () => {
    if (!checkIsNavigationSupported()) return
    window.navigation.addEventListener('navigate', (event) => {
        console.log(event.destination.url)
        const toUrl = new URL(event.destination.url)

        // es una navegación en otro dmoinio.
        if(location.origin != toUrl.origin ) return 

        // es una navegación en el mismo dominio.
        event.intercept({
            async handler(){
                const data = await fetchPage(toUrl.pathname)
                //utilizar la api de View Transition API
                document.startViewTransition(() =>{
                    // como tiene que actualizar la vista.
                    document.documentElement.scrollTop = 0
                    document.body.innerHTML = data
                    
                })
            }
        })
    })
}