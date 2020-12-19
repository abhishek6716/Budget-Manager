
var budgetController=(function(){

    var Expense = function(id, description, value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    var Income = function(id, description, value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;
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

    return {
        addItem: function(type, des, val){
            var newItem, ID;

            // creating unique id for each items
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            } else{
                ID = 0;
            }

            // creating new item based on 'inc' or 'dec' type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            // pushing into data structure
            data.allItems[type].push(newItem);

            // return new item
            return newItem;
        },

        calculateBudget: function(){

            // total income and expanses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate budget
            data.budget = data.totals.inc  - data.totals.exp;

            // calculate % of income spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else{
                data.percentage = -1;
            }
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage 
            };
        },

        testing: function(){
            console.log(data);
        }
    };

})();


var UIController=(function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expansesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };

    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) 
            };
        },

        addListItem: function(obj, type){

            var html, newHtml, element;

            // creating HTML with input placeholder text
            if(type === 'inc'){
            element = DOMstrings.incomeContainer;

            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">$%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp'){
            element = DOMstrings.expensesContainer;

            html = '<div class="item clearfix" id="expense-%d%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">$%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // replacing placeholder text with real data
            newHtml = html.replace('%d%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert the HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expansesLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    };
})();


// APP CONTROLLER
var controller=(function(budgetCtrl, UIctrl){

    var setupEventListeners = function(){
        var DOM = UIctrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
    
            if(event.keyCode === 13 || event.which ===13){
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function(){
        
        // 1. calculate budget
        budgetCtrl.calculateBudget();

        // 2. return budget
        var budget = budgetCtrl.getBudget();

        // 3. display the budget on UI
        UIctrl.displayBudget(budget);
    };

    var ctrlAddItem = function(){
        var input, newItem;
        
        // 1. get the field input data
        input = UIctrl.getInput();

        if(input.description == "" || input.value <= 0 || isNaN(input.value)){
            alert("Enter description and positive decimal value Both.");
        }

        if(input.description != "" && !isNaN(input.value) && input.value > 0){
            // 2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value); 

            // 3.1 add the item to the UI
            UIctrl.addListItem(newItem, input.type);

            // 3.2 clear fields
            UIctrl.clearFields();

            // 4. calculate and upadet budget
            updateBudget(); 
        }

    };

    return{
        init: function(){
            console.log('application has started');
            setupEventListeners();
        }
    };


})(budgetController, UIController);

controller.init();