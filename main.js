// Llamado a funcion categories() y se inyecta valor retornado a HTML
document.getElementById('categories').innerHTML = categories();
document.getElementById('eventsCards').innerHTML=eventsCards();


//Funcion que 
function cardList(eventType){

    const allEvents = data.events;
    let filteredEvents=[];
    
    switch (eventType){
        case "web1":
            filteredEvents = allEvents.filter(oneEvent => oneEvent.date < data.currentDate)
            break;
        case "web2":
            filteredEvents = allEvents.filter(oneEvent => oneEvent.date > data.currentDate)
            break;
        default:
            filteredEvents = allEvents;
        }

    return filteredEvents
}



function eventsCards(){

    let TitleId = document.querySelector('h1').id;

    const filteredEvents = cardList(TitleId)

    const newfilteredEvents=categoryFilter(filteredEvents);

    let cardsTemplate = '';

    for (let event of newfilteredEvents){
            cardsTemplate += 
            `
            <div class="card col-2">
                <img src=${event.image} height=40%>
                <div class="card-body">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text">${event.description}</p>
                    <div class="d-flex align-middle justify-content-between">
                        <span class="price">Price: ${event.price}</span>
                        <a href="details.html" class="btn btn-danger">View Details</a>
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
            id=${checkId}
            onclick="drawCards()">
            <label class="form-check-label" id=${labelId} for=${checkId}>
                ${category}
            </label>
        </div>
        `
        i+=1;
    }

    return categoriesTemplate;
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

function searchFilter(){
    
}

function drawCards(){

    document.getElementById('eventsCards').innerHTML=eventsCards();

}

