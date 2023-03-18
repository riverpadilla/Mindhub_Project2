// Llamado a funcion categories() y se inyecta valor retornado a HTML




function categories(){

    let listCategories = categoryList();

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



//Funcion que filtra los datos segun el tipo de eevntos a mostrar: Pasados, Futuros o por defecto, Todos. 
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

function eventsCards(){

    let TitleId = document.querySelector('main').id;
    let filteredEvents=[];

    filteredEvents = cardList(TitleId)

    filteredEvents = categoryFilter(filteredEvents);

    filteredEvents = searchFilter(filteredEvents);


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

function categoryList(){

    let listCategories=[];

    for (let event of data.events){
        listCategories.push(event.category);
    }

    listCategories = new Set(listCategories);

    return listCategories;
}

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


function drawCards(){
    document.getElementById('eventsCards').innerHTML=eventsCards();
}

function eventDetails(cardId){

    const detailedEvent = data.events.filter(dEvent => dEvent._id==cardId)[0];
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
                    <p>Place:${detailedEvent.place}</p>
                    <p>Capacity: ${detailedEvent.capacity} participants</p>
                    <p>Assistence: ${detailedEvent.assistance} participants</p>
                    <p>Price: US$ ${detailedEvent.price}</p>
                </div>
            </div>
        </div>

        ` 
    document.querySelector('main').innerHTML = detailsStr;
}


function checkIndex(pastEvents,array, element){
    let indexes=[];
    let results=[];
    let idx = array.indexOf(element);
    while (idx != -1) {
        indexes.push(idx);
        idx = array.indexOf(element, idx + 1);
    }     
    for (let index of indexes){
        results.push({name:pastEvents[index].name,value:array[index]});
    }
    return results;
}

function recordStats(){
    let pastEvents = cardList("web1");
    let i=0;
    let recordArray=[];
    let recordArray1=[];
    for (let event of pastEvents){
            recordArray[i]=event.assistance/event.capacity;
            recordArray1[i]=event.capacity;
            i++;
    } 
    
    let element = Math.max(...recordArray)
    let results=[];
    results.push(checkIndex(pastEvents,recordArray,element));
    
    element = Math.min(...recordArray)
    results.push(checkIndex(pastEvents,recordArray,element));
   
    
    element = Math.max(...recordArray1)
    results.push(checkIndex(pastEvents,recordArray1,element));

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
            recordStrArray[2]=`<td>${results[2][i].name}: ${results[2][i].value}</td>`;
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



function stats(status){
    let eventStats =[];
    let categories = categoryList();
    let events={};
    let statStr='';

    switch(status){
        case 0:
            events = cardList("web1");
            for(let category of categories){
                eventStats.push({name:category,revenue:0,assistance:0, capacity:0,pctAssistance:0})
                let curretCategory = eventStats[eventStats.length-1];
                for(let event of events){
                    if(event.category==category){
                        curretCategory.revenue += event.price*event.assistance;
                        curretCategory.assistance += event.assistance;
                        curretCategory.capacity += event.capacity;
                    }
                }
                curretCategory.pctAssistance = ((curretCategory.assistance/ curretCategory.capacity) * 100).toFixed(2) + '%';
                statStr +=
                `<tr>
                    <td>${category}</td>
                    <td>USD$ ${curretCategory.revenue}</td>
                    <td>${curretCategory.pctAssistance}</td>
                </tr>`
            }
        break;

        case 1:
            events = cardList("web2");
            for(let category of categories){
                eventStats.push({name:category,revenue:0,estimate:0, capacity:0,pctAssistance:0})
                let curretCategory = eventStats[eventStats.length-1];
                for(let event of events){
                    if(event.category==category){
                        curretCategory.revenue += event.price*event.estimate;
                        curretCategory.estimate += event.estimate;
                        curretCategory.capacity += event.capacity;
                    }
                }
                curretCategory.pctAssistance = ((curretCategory.estimate/ curretCategory.capacity) * 100).toFixed(2) + '%';
                statStr +=
                `<tr>
                    <td>${category}</td>
                    <td>USD$ ${curretCategory.revenue}</td>
                    <td>${curretCategory.pctAssistance}</td>
                </tr>`
            }
        break;
    }
    console.log(eventStats);
    return statStr;
}


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

const obtainData = async () =>{
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

const urlAPI ="https://mindhub-xj03.onrender.com/api/amazing";
let data;
obtainData()