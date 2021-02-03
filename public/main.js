const INSERT = 0;
const UPDATE = 1;
let action = INSERT;
let quoteId = null;

let formName = document.getElementById('name');
let formQuote = document.getElementById('quote');

function editQuote(id, name, quote) {
    action = UPDATE;
    prepareForm();   
    quoteId = id;
    formName.value = name;
    formQuote.value = quote;
}

function cancelEdit() {
    action = INSERT;
    quoteId = null;
    prepareForm();
}

function prepareForm() {
    document.getElementById('buttonCancel').style.display = (action === INSERT ? 'none' : 'inline-block');
    document.getElementById('actionMessage').innerHTML = (action === INSERT? 'Add' : 'Update') + ' a quote';    
}

function onSubmit(event) {
    // we allow submit to continue as normal if the action is insert
    if(action === INSERT) return true;
    // if not we prepare update and execute
    fetch('/quotes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: quoteId,
            name: formName.value,
            quote: formQuote.value
        })
    }).then(response => {
            // if success response we return promise of turning the response on json
            if(response.ok) return response.json();
    }).then(response => {
        location.reload();
    }); // reload page
    return false; // stop submit
}

function deleteQuote(id) {
    const deleteAnswer = confirm('Do you wish to delete the quote?');
    if(!deleteAnswer) return; // do not delete
    fetch(`/quotes/${id}`, {
        method: 'delete'        
    }).then(response => {
            // if success response we return promise of turning the response on json
            if(response.ok) return response.json();
    }).then(response => {
        if(response.deleted > 0) location.reload();
        else alert('Quote could not be found.');
    }); // reload page
}