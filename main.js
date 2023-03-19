// ARCHIVO JAVASCRIPT MAIN.JS CREADO POR RIVELINO PADILLA - PROYECTO AMAZING EVENTS - MINDHUB FE13-TN
// Archivo principal con general con funciones para cálculos y actualización de diferentes paginas HTML del proyecto


// Funcion que genera el código HTML para los checkboxes de categorias en las paginas HMTL para Home, Upcoming Events y Past Events
// basado en las categorias que aparecen en el API y para evitar repetir el mismo código en las tres paginas
// Utiliza la funcion listCategories() para generar la lista de categorias
// Retorna un string
function categories(){

    let listCategories = categoryList(); // Asigna a variable un set de categorias retornado por función categoryList()

    let categoriesTemplate = '';
    let checkId;
    let labelId;
    let i=0;
    for (const category of listCategories){     
        checkId="checkBoxId"+i;
        labelId="checkLabelId"+i;
        categoriesTemplate += `
            <div class="form-check col-4">
            <input class="form-check-input" 
                type="checkbox" 
                value=${i} 
                id=${checkId}>
                <label class="form-check-label" id=${labelId} for=${checkId}>
                    ${category}
                </label>
            </div>
            `
        i+=1;
    }

    return categoriesTemplate;
}
//********************************************************************************************************************


//Función que genera el código HTML para la barra de busqueda en las paginas HMTL para Home, Upcoming Events y Past Events
// para evitar repetir el mismo código en las 3 paginas.
// Retorna un string.
function searchBar(){

    let searchBarStr=
        `
        <input class="form-control border-end-0 rounded-end-0 pe-0"
            type="text" 
            placeholder="Search  by Event's Name" 
            aria-label="Search" 
            spellcheck="false" 
            data-ms-editor="true"
            aria-describedby="search"
            id="searchInput">
        <button class="btn bg-dark text-white rounded-start-0 py-0" type="button" title="btn-search" id="searchBtn">
            <i class="fa-solid fa-magnifying-glass fa-lg"></i>
        </button>
        `

    return searchBarStr
}
//********************************************************************************************************************


// Funcion que retorna un array filtrando los datos del API segun el tipo de eventos a mostrar: Pasados, Futuros o Todos(Por Defecto).
// Require un parámetro para ejecuarse: "web1" si son eventos pasados, "web2" si son eventos futuros u otro si son todos los eventos
function cardList(eventType){

    const allEvents = data.events;
    let filteredEvents=[];
    
    switch (eventType){
        case "web1":
            filteredEvents = allEvents.filter(oneEvent => oneEvent.date < data.currentDate); //Filtra los eventos Pasados
            break;
        case "web2":
            filteredEvents = allEvents.filter(oneEvent => oneEvent.date > data.currentDate); //Filtra los eventos futuros
            break;
        default:
            filteredEvents = allEvents;
        }

    return filteredEvents
}
//********************************************************************************************************************


//Función que genera el código HTML para las tarjetas de eventos en las paginas HMTL para Home, Upcoming Events y Past Events
// para evitar repetir el mismo código en las 3 paginas.
// Utiliza la funcion cardList() para para filtar los eventos Pasados, Futuros o Todos(Por Defecto).
// Utiliza la función categoryFilter() para filtar por categoria seleccionada en checkbox
// Utiliza la función searchFilter() para filtar por cadena introducida en caja de busqueda
// Retorna un string.
function eventsCards(){

    let TitleId = document.querySelector('main').id;
    let filteredEvents=[];

    filteredEvents = cardList(TitleId); // Asigna a valiable un array filtrado por tipo de evento : pasado, futuro o todos

    filteredEvents = categoryFilter(filteredEvents); // Asigna a variable un array filtrado por categorias seleccionadas en checkbox

    filteredEvents = searchFilter(filteredEvents); // Asigna a variable un array filatrdo por cadena introducida en caja de busqueda


    let cardsTemplate = '';

    for (let event of filteredEvents){

            cardsTemplate += 
            `
            <div class="card col-2" id="cardID_${event._id}">
                <img src=${event.image} class ="card-img-top" height=40%>
                <div class="card-body">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text">${event.description}</p>
                    <div class="d-flex align-middle justify-content-between">
                        <span class="price">Price: US$ ${event.price}</span>
                        <a href="details.html?id=${event._id}" class="btn btn-danger" id="buttonID_${event._id}">View Details</a>
                    </div>
                </div>
            </div>
            `
    }

    return cardsTemplate;
}
//********************************************************************************************************************


// Funcion que retorna un set o lista de categorias a partir de las categorias presentes en los datos del API
// el set retornado filtra automaticamente para que las categorias sean unicas (no estan repetidas en el set)
function categoryList(){

    let listCategories=[];

    for (let event of data.events){
        listCategories.push(event.category);
    }

    listCategories = new Set(listCategories);

    return listCategories;
}
//********************************************************************************************************************


// Funcion que retorna un array filtrado por las categorias seleccionadas en los checkboxes
// Requiere como parámetro el array que se desea filtrar 
function categoryFilter(filteredEvents){

    let newfilteredEvents=filteredEvents;
    const categoryNode = document.querySelectorAll('.form-check-input');
    
    const check = Array.from(categoryNode).some(category => category.checked);
    
    if (check){
        newfilteredEvents=[];
        let tempEvents=[]
        for(category of categoryNode){
            tempEvents = filteredEvents.filter(events =>{
                if ((category.checked) && (events.category==category.labels[0].innerText)){
                    return true
                } else {
                    return false
                }
            })
            newfilteredEvents=newfilteredEvents.concat(tempEvents);
        } 
    }
          
    return newfilteredEvents
}
//********************************************************************************************************************

// Funcion que retorna un array filtrado por la cadena de texto en la caja de busqueda
// Requiere como parámetro el array que se desea filtrar
function searchFilter(filteredEvents){
    
    let newfilteredEvents = filteredEvents;
    let searchCheck=false;
    if (searchInput.value){
        let searchStr='';
        let searchTarget=searchInput.value.toLowerCase();

        newfilteredEvents = filteredEvents.filter(events =>{
            searchStr=events.name.toLowerCase();
            searchCheck=searchStr.indexOf(searchTarget);
            if(searchCheck!=-1){
                return true
                
            }else {
                return false
                
            }
        })
    }
    return newfilteredEvents;
}
//********************************************************************************************************************


// Función que inyecta el código HTML en las paginas Home, Upcoming Events y Past Events para que se dibujen las tarjetas de eventos
function drawCards(){
    return document.getElementById('eventsCards').innerHTML=eventsCards();
}
//********************************************************************************************************************

// Funcion que inyecta el código HTML en la pagina Details para que se dibuje la tarjeta del evento con detallada
// Requiere como parámetro el Id del evento del cualse desean los detalles
function eventDetails(cardId){

    const detailedEvent = data.events.filter(dEvent => dEvent._id==cardId)[0];
    let assistanceStr='';
    if(data.currentDate>detailedEvent.date){
        assistanceStr=` <p>Assistence: ${new Intl.NumberFormat('en-US').format(detailedEvent.assistance)} participants</p>`
    }else  assistanceStr=` <p>Assistence: ${new Intl.NumberFormat('en-US').format(detailedEvent.estimate)} participants (Estimated)</p>`

    
    detailsStr=
        `
        <div class="container-fluid d-flex row justify-content-center gap-2">
            <div class="card details-card d-flex justify-content-center col-5">
                <img src="${detailedEvent.image}" class="img-fluid" alt="${detailedEvent.name}" >
            </div>
            <div class="card details-card d-flex col-5">
                <div class="card-body border border-3 border-danger rounded">
                    <h5 class="card-title">${detailedEvent.name}</h5>
                    <p>Date: ${detailedEvent.date}</p>
                    <p>Description: ${detailedEvent.description}</p>
                    <p>Category: ${detailedEvent.category}</p>
                    <p>Place: ${detailedEvent.place}</p>
                    <p>Capacity: ${new Intl.NumberFormat('en-US').format(detailedEvent.capacity)} participants</p>
                    ${assistanceStr}
                    <p>Price: US$ ${detailedEvent.price}</p>
                </div>
            </div>
        </div>

        ` 
    return document.querySelector('main').innerHTML = detailsStr;
}
//********************************************************************************************************************


// Funcion que retorna un array que contiene objetos con nombre y valor de los eventos record de interes
// Esta funcion esta pensada para devolver los datos de mas de un evento si varios cumplen la condicion de busqueda
// Requiere 3 parametros: array de eventos a filtar, array con valores de interes, elemento a buscar
function checkIndex(pastEvents,recordArray, element){
    let indexes=[];
    let results=[];
    let idx = recordArray.indexOf(element);
    while (idx != -1) {
        indexes.push(idx);
        idx = recordArray.indexOf(element, idx + 1);
    }     
    for (let index of indexes){
        results.push({name:pastEvents[index].name,value:recordArray[index]});
    }
    return results;
}
//********************************************************************************************************************


// Función que genera el código HTML para completar la tabla Event Statistics en la pagina de estadisticas
// Utiliza la función cardList() para recuperar los eventos filtados de los datos de la API
// Utiliza la función checkIndex() para recuperar los eventos que cumplen con la condicion de busqueda
function recordStats(){
    let pastEvents = cardList("web1"); // Asigna el array retornado por la funcion cardList() con el parámetro de eventos pasados ("web1")
    let i=0;
    let recordArrayPCT=[];
    let recordArrayCap=[];
    for (let event of pastEvents){
            recordArrayPCT[i]=event.assistance/event.capacity;
            recordArrayCap[i]=event.capacity;
            i++;
    } 
    
    let element = Math.max(...recordArrayPCT)
    let results=[];
    results.push(checkIndex(pastEvents,recordArrayPCT,element)); // Adiciona al array de resultados un array de los eventos con mayor porcentaje de asistencia
    
    element = Math.min(...recordArrayPCT)
    results.push(checkIndex(pastEvents,recordArrayPCT,element)); // Adiciona al array de resultados un array de los eventos con menor porcentaje de asistencia
   
    
    element = Math.max(...recordArrayCap)
    results.push(checkIndex(pastEvents,recordArrayCap,element)); // Adiciona al array de resultados un array de los eventos con mayor capacidad

    let recordItems=0;
    for(record of results){
        if (record.length>recordItems){
          recordItems=record.length  
        }
    }

    for(record of results){
        while (record.length<recordItems){
            record.push({name:'',value:''});   
        }
    }

    let statStr='';
    let recordStrArray=[[],[],[]];
    
    for (let i=0;i<recordItems;i++){

        if (results[0][i].name!=''){
            recordStrArray[0]=`<td>${results[0][i].name}: ${(results[0][i].value*100).toFixed(2)}% </td>`;
        }else{
            recordStrArray[0]=`<td></td>`;
        }
        if (results[1][i].name!=''){
            recordStrArray[1]=`<td>${results[1][i].name}: ${(results[1][i].value*100).toFixed(2)}% </td>`;
        }else{
            recordStrArray[1]=`<td></td>`;
        }
        if (results[2][i].name!=''){
            recordStrArray[2]=`<td>${results[2][i].name}: ${new Intl.NumberFormat('en-US').format(results[2][i].value)}</td>`;
        }else{
            recordStrArray[2]=`<td></td>`;
        }

        statStr +=
            `<tr>` +
            recordStrArray[0] + recordStrArray[1] + recordStrArray[2]
            + `</tr>` 
    }
    return statStr;
}
//********************************************************************************************************************


// Función que genera el código HTML para completar las tablas por categoría para enventos pasado y futuros
// Requiere el parámetro status de indica se son eventos pasados (valor 0) o eventos futuros (valor 1)
// Utiliza la función cardList() para recuperar los eventos filtados de los datos de la API
function stats(status){
    let eventStats =[];
    let categories = Array.from(categoryList());
    let events={};
    let statStr='';

    // categories.sort();
    switch(status){
        case 0:
            events = cardList("web1");
            for(let category of categories){
                eventStats.push({name:category,revenue:0,pctAssistance:0})
                let currentCategory = eventStats[eventStats.length-1];
                let eventsCount=0
                for(let event of events){
                    if(event.category==category){
                        currentCategory.revenue += event.price*event.assistance;
                        currentCategory.pctAssistance +=(event.assistance/event.capacity);
                        eventsCount++;
                    }
                }
                currentCategory.pctAssistance = ((currentCategory.pctAssistance/eventsCount)*100).toFixed(2) + '%';
                if (currentCategory.revenue>0){
                    statStr +=
                    `<tr>
                        <td>${category}</td>
                        <td>USD$ ${new Intl.NumberFormat('en-US').format(currentCategory.revenue)}</td>
                        <td>${currentCategory.pctAssistance}</td>
                    </tr>`
                }
            }
        break;

        case 1:
            events = cardList("web2");
            for(let category of categories){
                eventStats.push({name:category,revenue:0,pctAssistance:0})
                let currentCategory = eventStats[eventStats.length-1];
                let eventsCount=0
                for(let event of events){
                    if(event.category==category){
                        currentCategory.revenue += event.price*event.estimate;
                        currentCategory.pctAssistance +=(event.estimate/event.capacity);
                        eventsCount++;
                    }
                }
                currentCategory.pctAssistance = ((currentCategory.pctAssistance/eventsCount)*100).toFixed(2) + '%';
                if (currentCategory.revenue>0){
                    statStr +=
                    `<tr>
                        <td>${category}</td>
                        <td>USD$ ${new Intl.NumberFormat('en-US').format(currentCategory.revenue)}</td>
                        <td>${currentCategory.pctAssistance}</td>
                    </tr>`
                }
            }
        break;
    }

    return statStr;
}
//********************************************************************************************************************


// Funcion que agrupa las sentencias generales del codigo que deben cumplirse despues de se se cumple la promesa de evento asincrono
function mainProgram(){
    const TitleId = document.querySelector('main').id;

    switch(TitleId){

        case "web0":
        case "web1":
        case "web2":

            document.getElementById('categories').innerHTML = categories();
            document.querySelector('.searchBar').innerHTML = searchBar();
            
            const categoryCheck = document.getElementById('categories');
            const searchInput = document.querySelector('#searchInput');
            const searchBtn = document.querySelector('#searchBtn');
            const eventCards = document.getElementById('eventsCards');
            
            document.getElementById('eventsCards').innerHTML=eventsCards()

            searchBtn.addEventListener('click',drawCards);
            categoryCheck.addEventListener('click',drawCards)
            
            eventCards.addEventListener('click',(e)=> {
                searchInput.value="";
                drawCards()
            });
            break;
        case "web4":
            document.getElementById('stats-records').innerHTML = recordStats();
            document.getElementById('stats-past').innerHTML = stats(0);
            document.getElementById('stats-upcoming').innerHTML = stats(1);

            break;
        case "web5":
            const queryString = location.search;
            const params = new URLSearchParams(queryString);
            const id=params.get("id");
            eventDetails(id);
    }

}
//********************************************************************************************************************


// Funcion asincrona que se encarga de recuperar los datos de la API
// Incluye un try-catch en caso que se presente un error al recuperar los datos de API
// El caso de error se utiliza el archivo data.JSON inlcuido en la aplicación
// Utiliza la funcion mainProgram() para continuar el fujo dle programa
async function obtainData(){
    try{
        const response = await fetch(urlAPI)
        data = await response.json()
        mainProgram();
    }
    catch(error){
        fetch('./data.json')
            .then((response) => response.json())
            .then((json) => {
                data = json 
                mainProgram();
            })
    }
}
//********************************************************************************************************************

// Programa principal que llama a la funcion obtainData()
const urlAPI ="https://mindhub-xj03.onrender.com/api/amazing";
let data;
obtainData()