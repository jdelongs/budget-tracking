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

    var calculateTotal = function(type) {
        var sum = 0; 
        data.allItems[type].forEach(function(current) {
            sum += current.value; 
        });
        data.totals[type] = sum; 
    };
 
    var data = {
        allItems: {
            exp: [], 
            inc: []
        },

        totals: {
            exp: 0, 
            inc: 0
        },

        budget: 0, 
        percentage: -1
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

        calculateBudget: function() {

            // calculate total income and expenses 
            calculateTotal('exp'); 
            calculateTotal('inc'); 

            //calculate the budget: income - expeses 
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of the income that has been spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
            } else {
                data.percentage = -1
            }

        }, 

        getBudget: function() {
            return {
                budget: data.budget, 
                totalInc: data.totals.inc, 
                totalExp: data.totals.exp, 
                percentage: data.percentage
            }
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
        expensesContainer: '.expenses__list', 
        budgetLabel: '.budget__value', 
        totalIncomeLabel: '.budget__income--value',
        totalExpensesLabel: '.budget__expenses--value', 
        totalPercentageLabel: '.budget__expenses--percentage'  
    }; 
    
    //PUBLIC
    return {

        getInput: function() {
            return {
            type: document.querySelector(DOMstrings.inputType).value, //will e either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value, 
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //convert string to number
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

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = '$' + obj.budget;
            document.querySelector(DOMstrings.totalIncomeLabel).textContent = '+ $' + obj.totalInc;
            document.querySelector(DOMstrings.totalExpensesLabel).textContent = '- $' + obj.totalExp;
            

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.totalPercentageLabel).textContent = obj.percentage + '%'; 
            } else {
                document.querySelector(DOMstrings.totalPercentageLabel).textContent = '---'; 
            }
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
        console.log('getDOMSTRINGS()');  
        var DOM = UICtrl.getDOMStrings(); 
        


        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); 

        //allows the user to click the enter key
        document.addEventListener('keypress', function(event) {

            if(event.keyCode === 13 || event.which === 13) {
                console.log('ctrlAddItem()'); 
                ctrlAddItem(); 
            }
        }); 

    }

    var updateBudget = function() {
        //calculate the budget 
        console.log('calculateBudget'); 
        budgetCtrl.calculateBudget(); 
        

        //return the budget 
        console.log('getBudget()'); 
        var budget = budgetCtrl.getBudget(); 

        // display the budget on the UI
        UICtrl.displayBudget(budget); 
    }
 
    var ctrlAddItem = function() {
    var input, newItem; 

    //get the user input from the input field 
    console.log('getInput()'); 
    input = UICtrl.getInput();
 
    
    if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

        // add the item to the budget controller 
        console.log('addItem()'); 
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
       

        //add the item to the user interface
        console.log('addListItem()'); 
        UICtrl.addListItem(newItem, input.type); 
    

        //clear the fields 
        console.log('clearFields()');
        UICtrl.clearFields();  
        //calculate and upate budget 
        console.log('updateBudget()'); 
        updateBudget(); 
      
    }
   

    }
    
    //PUBLIC
    return {
        init: function() {
            console.log('application has started'); 
            setupEventListeners(); 
            UICtrl.displayBudget( { budget: 0, 
                totalInc: 0, 
                totalExp: 0, 
                percentage: 0}); 
        }
    }; 

})(budgetController, UIContoller);  

contoller.init(); 

