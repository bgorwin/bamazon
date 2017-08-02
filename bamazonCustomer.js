var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});

//global variables
var shoppingCart = [];
var totalCost = 0;

//connect to mysql and then run the main function
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    printItems(function(){
      // userSelectsItem();
    });
});

//function to print all items to the console, uses npm module cli-table
function printItems(cb){
  //new cli-table

  var table = new Table({
    head: ['id_number', 'product_name', 'department_name', 'price', 'stock_quantity']
  });
  //get all rows from the Products table
  connection.query('SELECT * FROM products', function(err, res){
    if (err) throw err;
    //add all of the rows to the cli-table
    for (var i = 0; i < res.length; i++)
    {
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, '$' + res[i].price, + res[i].stock_quantity]);

    }

    //log the table to the console
    console.log(table.toString());

    //callback the userSelectsItems function to prompt the user to add items to cart
    cb();
    start();
    });
  }

  function start() {
    var items = [];
      //get all product names from the Products table
      connection.query('SELECT product_name FROM products', function(err, res){
        if (err) throw err;
        //push all product names into the item array
        for (var i = 0; i < res.length; i++) {
          items.push(res[i].product_name);
        }
      });

    inquirer
      .prompt({
        name: "item",
        type: "list",
        message: "Which products would you like to add to your cart?",
        choices: ["Nikon", "Canon", "Sony", "Fuji", "Panasonic"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        howMany();

      });
    }

    function howMany() {
      var items = [];
        //get all product names from the Products table
        connection.query('SELECT product_name FROM products', function(err, res){
          if (err) throw err;
          //push all product names into the item array
          for (var i = 0; i < res.length; i++) {
            items.push(res[i].product_name);
          }
        });

      inquirer
        .prompt({
          name: "item",
          type: "input",
          message: "How many would you like?"
        })
        .then(function(answer) {
          // based on their answer, either call the bid or the post functions
            console.log("------------------------------");
            console.log("Your total is $2000");
            console.log("------------------------------");
            buyMore();
        });
      }

      function buyMore() {
        var items = [];
          //get all product names from the Products table
          connection.query('SELECT product_name FROM products', function(err, res){
            if (err) throw err;
            //push all product names into the item array
            for (var i = 0; i < res.length; i++) {
              items.push(res[i].product_name);
            }
          });

        inquirer
          .prompt({
            name: "item",
            type: "list",
            message: "Would you like to purchase another item?",
            choices: ["Yes", "No"]
          })
          .then(function(answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.item === "Yes") {
              console.log("------------------------------");
              start();

            } else {
              console.log("Thank you for shopping with us!");

            }
          });
        }
