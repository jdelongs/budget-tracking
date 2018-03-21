//immediately invoked function expressions(IIFE) 
/********************
 * BUDGET CONTROLLER
 ********************/
var budgetController = (() => {
    //PRIVATE
    //function contructors
    var Expense = function(id, description,value) {
        this.id = id; 
        this.description = description; 
        this.value = value; 
    }; 

    var Income = function(id, description,value) {
        this.id = id; 
        this.description = description; 
        this.value = value; 
    }; 
    
    var data = {
        allItems: {
            exp: [], 
            inc: []
        },

        totals: {
            exp: 0, 
            inc: 0
        }
    }
    
    //PUBLIC
    return { 
        addItem: function(type, desc, val) {
            var newItem, ID; 

            //create new iD
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0; 
            }

            //create new item based on input
            if (type === 'exp') {
                newItem = new Expense(ID, desc, val); 
            } else if (type === 'inc') {
                newItem = new Income(ID, desc, val); 
            }

            //push to data structure 
            data.allItems[type].push(newItem); 

            //return the new element
            return newItem; 
        }, 
        
        testing: function() {
            console.log(data); 
        }
        
    }; 

})(); 

/********************
 * UI CONTROLLER
 ********************/
var UIContoller = (() => {
    //PRIVATE

    //DOM class/id strings  
    var DOMstrings = {
        inputType: '.add__type',  
        inputDescription: '.add__description', 
        inputValue: '.add__value', 
        inputBtn: '.add__btn'    
    }; 
    
    //PUBLIC
    return {

        getinput: () => {
            return {
            type: document.querySelector(DOMstrings.inputType).value, //will e either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value, 
            value: document.querySelector(DOMstrings.inputValue).value 
            };    
        }, 

        getDOMStrings: () => {
            return DOMstrings; 
        }
    }; 
})(); 


/********************
 * GLOBAL APP CONTROLLER
 ********************/
var contoller = ( (budgetCtrl, UICtrl) => {
    //PRIVATE
    var setupEventListeners = () => {
        var DOM = UICtrl.getDOMStrings();  

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); 

        //allows the user to click the enter key
        document.addEventListener('keypress', (event) => {

        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem(); 
        }
    }); 

    }
   
    //PUBLIC
    var ctrlAddItem = () => {
    var input, newItem; 
    //get the user input from the input field 
    input = UICtrl.getinput();

    //make sure that the input is greater than 0 
    
    // add the item to the budget controller 
    newItem = budgetController.addItem(input.type, input.description, input.value); 
    //add the item to the user interface

    //calculate the budget 

    // display the budget on the UI

    }

    return {
        init: () => {
            console.log('application has started'); 
            setupEventListeners(); 
        }
    }; 

})(budgetController, UIContoller);  

contoller.init(); 

