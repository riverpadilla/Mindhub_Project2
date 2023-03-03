
let listCategories=[];

for (let event of data.events){
    listCategories.push(event.category);
}

listCategories = new Set(listCategories);

let categoriesTemplate = '';
for (const category of listCategories){
    categoriesTemplate += `
    <div class="form-check col-3">
    <input class="form-check-input" type="checkbox" value="" id="flexCheck1">
        <label class="form-check-label" for="flexCheck1">
            ${category}
        </label>
    </div>
    `
} 
document.getElementById('categories').innerHTML=categoriesTemplate;



