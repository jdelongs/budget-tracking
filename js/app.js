//immediately invoked function expressions(IIFE) 
/********************
 * BUDGET CONTROLLER
 ********************/
var budgetController = (function()  {
    //PRIVATE

    //function contructors
    var Expense = function(id, description, value) {
        this.id = id; 
        this.description = description; 
        this.value = Math.round(value * 100) / 100; 
        this.percentage = -1; 
    }; 

    Expense.prototype.calcPercentage = function(totalInc) {

        if (totalInc > 0) {
            this.percentage = Math.round((this.value / totalInc) * 100); 
        } else {
            this.percentage = -1; 
        }
    }; 

    Expense.prototype.getPercentage = function() {
        return this.percentage; 
    }; 
    var Income = function(id, description, value){
        this.id = id; 
        this.description = description; 
        this.value = value; 
    };

    //calculates the total income and expenses based on type
    var calculateTotal = function(type) {
        var sum = 0; 
        data.allItems[type].forEach(function(current) {
            sum += current.value; 
        });
        data.totals[type] = sum; 
    };
    
    
    var data = {


        //these arrays store the expense and income objects ID, description and value
        allItems: {
            exp: [], 
            inc: []
        },

        //this is where the total income and expenses are stored 
        totals: {
            exp: 0, 
            inc: 0
        },

        //budget is the income - the expenses
        budget: 0, 
        percentage: -1
    }; 


    //PUBLIC
    return {
        
        //add and item to the data structure and give it a unique id
        addItem: function(type, des, val) {
            var newItem, ID; 
            //create new ID and increment by 1 everytime, if there is no ID set it to 0
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0; 
            }

            //create new item based on input type I.E - or +
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

        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id; 
            }); 

            index = ids.indexOf(id); 
            
            if(index !== -1) {
                data.allItems[type].splice(index, 1); 
            }
        }, 

        calculateBudget: function() {

            //calculates the total expenses
            calculateTotal('exp');
            
            //calculates the total income
            calculateTotal('inc'); 

            //calculates the total budget: income - expeses 
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of the income that has been spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
            } else {
                data.percentage = -1
            }

        }, 

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc); 
            }); 
        },  

        getPercentages: function() {
            var allPercentages = data.allItems.exp.map(function(cur) {
                return cur.getPercentage(); 
            }); 
            return allPercentages; 
        }, 
        //get the new budget income expenses and percentage
        getBudget: function() {
            return {
                budget: data.budget, 
                totalInc: data.totals.inc, 
                totalExp: data.totals.exp, 
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data.allItems); 
        }
     
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
        totalPercentageLabel: '.budget__expenses--percentage', 
        containerLabel: '.container',
        expensesPercentLabel: '.item__percentage',  
        dateLabel: '.budget__title--month' 
    }; 
    
    //PUBLIC
    return {

        //get the input from the user
        getInput: function() {
            return {
            type: document.querySelector(DOMstrings.inputType).value, //will e either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value, 
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //convert string to number
            };    
        }, 

        //adds html based based on if its inc or exp
        addListItem: function(obj, type) {
            var html, newHtml, element;
            //create html string with placeholder text 
            if(type === 'inc') {
                element = DOMstrings.incomeContainer; 

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ $%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>'; 
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer; 

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">- $%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
            }
            //replace the placolder text with  actual data
            newHtml = html.replace('%id%', obj.id); 
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value); 
            //we insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);   
        },

        deleteListItem: function(selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        }, 

        displayMonth: function(){
            var now,month, months, year; 
            now = new Date(); 

            months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

            month = now.getMonth(); 
            year = now.getFullYear();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year; 
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

        displayPercentages: function(percentages) {
            var percentageFields;
         
            percentageFields = document.querySelectorAll(DOMstrings.expensesPercentLabel);

            var nodeListForEach = function(list, callback){
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i); 
                }
            }; 

            nodeListForEach(percentageFields, function(current, index){
                if (percentages[index] > 0){                
                    current.textContent = percentages[index] + '%'; 
                } else {
                    current.textContent = percentages[index] + '---'; 
                }
            }); 
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

        document.querySelector(DOM.containerLabel).addEventListener('click', ctrlDeleteItem); 

    }; 

    var updateBudget = function() {
        //calculate the budget 
        budgetCtrl.calculateBudget(); 
        

        //return the budget 
        var budget = budgetCtrl.getBudget(); 

        // display the budget on the UI
        UICtrl.displayBudget(budget); 
    }
    
    var updatePercentages = function() {

        //calculate percentages
        budgetCtrl.calculatePercentages(); 

        //read percentages from the budget controller 
        var percentages = budgetCtrl.getPercentages(); 

        //update the UI controller 
        UICtrl.displayPercentages(percentages); 
    }; 

    var ctrlAddItem = function() {
        var input, newItem; 

        //get the user input from the input field 
        input = UICtrl.getInput();
    
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // add the item to the budget controller 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        

            //add the item to the user interface
            UICtrl.addListItem(newItem, input.type); 
        

            //clear the fields 
            UICtrl.clearFields();  

            //calculate and upate budget 
            updateBudget(); 

            //calculate and update percentages 
            updatePercentages(); 
        }
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, type, ID; 
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {

            //split the id string
            splitID = itemID.split('-'); 
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //delete the item from the data structure 
            budgetCtrl.deleteItem(type, ID); 

            //delete the item from the UI
            UICtrl.deleteListItem(itemID); 

            //update and show the new budget 
            updateBudget(); 

            //calculate and update percentages
            updatePercentages(); 



        }
    };

    //PUBLIC
    return {
        init: function() {
            setupEventListeners(); 
            UICtrl.displayBudget( { budget: 0, 
                totalInc: 0, 
                totalExp: 0, 
                percentage: 0}); 
            UICtrl.displayMonth(); 
        }
    }; 

})(budgetController, UIContoller);  

contoller.init(); 

