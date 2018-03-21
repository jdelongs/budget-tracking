//immediately invoked function expressions(IIFE) 
/********************
 * BUDGET CONTROLLER
 ********************/
var budgetController = (function()  {
    //PRIVATE
    //function contructors
    var Expense = function(id, description,value) {
        this.id = id; 
        this.description = description; 
        this.value = Math.round(value * 100) / 100; 
    }; 

    var Income = function(id, description,value){
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
    }; 
    
    //PUBLIC
    return { 
        addItem: function(type, des, val) {
            var newItem, ID; 

            //create new iD
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0; 
            }

            //create new item based on input
            if (type === 'exp') {
                newItem = new Expense(ID, des, val); 
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val); 
            }

            //push to data structure 
            data.allItems[type].push(newItem); 

            //return the new element
            return newItem; 
        }, 

    }; 

})(); 

/********************
 * UI CONTROLLER
 ********************/
var UIContoller = (function() {
    //PRIVATE

    //DOM class/id strings  
    var DOMstrings = {
        inputType: '.add__type',  
        inputDescription: '.add__description', 
        inputValue: '.add__value', 
        inputBtn: '.add__btn', 
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'   
    }; 
    
    //PUBLIC
    return {

        getinput: function() {
            return {
            type: document.querySelector(DOMstrings.inputType).value, //will e either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value, 
            value: document.querySelector(DOMstrings.inputValue).value 
            };    
        }, 

        addListItem: function(obj, type) {
            var html, newHtml, element;
            //create html string with placeholder text 
            if(type === 'inc') {
                element = DOMstrings.incomeContainer; 

                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ $%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>'; 
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer; 

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">- $%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
            }
            //replace the placolder text with  actual data
            newHtml = html.replace('%id%', obj.id); 
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            console.log(obj.value);  
            //we insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);   
        }, 

        //clear the input fields  
        clearFields: function() {
            var fields, fieldsArr; 
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue); 

            //copy fields node list into an array
            fieldsArr = Array.prototype.slice.call(fields); 

            fieldsArr.forEach(function(currentVal, index, array) {
                currentVal.value = ''; 
            });
            
            fieldsArr[0].focus(); 
        },

        //gets the DOM string object
        getDOMStrings: function() {
            return DOMstrings; 
        }
    }; 
})(); 


/********************
 * GLOBAL APP CONTROLLER
 ********************/
var contoller = (function(budgetCtrl, UICtrl) {
    //PRIVATE
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();  

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); 

        //allows the user to click the enter key
        document.addEventListener('keypress', function(event) {

        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem(); 
        }
    }); 

    }
   
    //PUBLIC
    var ctrlAddItem = function() {
    var input, newItem; 
    //get the user input from the input field 
    input = UICtrl.getinput();

    // add the item to the budget controller 
    newItem = budgetCtrl.addItem(input.type, input.description, input.value); 
    //add the item to the user interface
    UICtrl.addListItem(newItem, input.type); 

    //clear the fields 
    UIContoller.clearFields(); 
    //calculate the budget 

    // display the budget on the UI

    }

    return {
        init: function() {
            console.log('application has started'); 
            setupEventListeners(); 
        }
    }; 

})(budgetController, UIContoller);  

contoller.init(); 

