
var budgetController=(function(){

})();


var UIController=(function(){

})();


// APP CONTROLLER
var controller=(function(budgetCtrl, UIctrl){

    var ctrlAddItem = function(){
        
        // 1. get the field input data

        // 2. add the item to the budget controller

        // 3. add the item to the UI

        // 4. calculate the budget

        // 5. display the budget on the UI

        console.log('It works');
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){

        if(event.keyCode === 13 || event.which ===13){
            ctrlAddItem();
        }
    });

})(budgetController, UIController);