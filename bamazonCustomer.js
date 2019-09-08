var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  displayInfo();
});

function displayInfo() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        inquirer
        .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push("Item: " + results[i].product_name + " || Price: " + results[i].price);
            }
            return choiceArray;
          },
          message: "Which product would you like to buy?"
        },
        {
          name: "stock",
          type: "input",
          message: "How many units of the product would you like to buy?",
        }
      ])
      .then(function(answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                // console.log(answer.choice.indexOf(results[i].product_name) > -1);
              if (answer.choice.indexOf(results[i].product_name) > -1) {
                //   console.log('made it!')
                chosenItem = results[i];
              }
            }
            console.log(chosenItem);
            if (chosenItem.stock_quantity > parseInt(answer.stock)) {
                var value = Math.abs(answer.stock - chosenItem.stock_quantity)
              var query = connection.query(
                "UPDATE products SET stock_quantity=" + value + " WHERE product_name='" + chosenItem.product_name +"'",
                function(error) {
                  if (error) throw err;
                  console.log("Order placed successfully!");
                  console.log("Price: " + chosenItem.price * answer.stock); 
                }
                
              );
            }
            else {
              console.log("Insufficient quantity!");
              displayInfo();
            }
          });
      });
    }
    