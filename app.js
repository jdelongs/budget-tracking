//Immiediatly invoked function expressions(IIFE)
/********************
 * BUDGET CONTROLLER
 ********************/
var budgetController = (() => {
    //some code
})(); 


/********************
 * UI CONTROLLER
 ********************/
var UIContoller = (() => {
    //private

    //DOM class/id strings  
    var DOMstrings = {
        inputType: '.add__type',  
        inputDescription: '.add__description', 
        inputValue: '.add__value', 
        inputBtn: '.add__btn'    
    }; 
    
    //public
    return {
        getinput: () => {
            return {
            type: document.querySelector(DOMstrings.inputType).value, //will e either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value, //will be a string
            value: document.querySelector(DOMstrings.inputValue).value //will be a decimal number/int
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
    //private
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
   

    //public
    var ctrlAddItem = () => {

    //get the user input from the input field 
    var input = UICtrl.getinput();

    //make sure that the input is greater than 0 
    
    // add the item to the budget controller 

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

