# Leaf Me Alone

CS340: Introduction to Databases Portfolio Project

## Description

This project is intended to demonstrate the ability to perform CRUD operations on several tables in a mySQL database through a front end. We feature a fictional plant store called Leaf Me Alone which offers plants in varying stages, from seed to full maturity. Leaf me alone has over 100 different plants for sale and averages about 10,000 orders anually totalling to $200,000. This project features five main entities: Plants, PlantTypes, Customers, Orders and OrderItems.

## Features

- CRUD functionality on all tables
- An M:N relationship between Plants and Suppliers
- Auto populated dynamic dropdown lists

## Requirements

- Node.js
- Express
- Express Handlebars

## Citations

All Express Handlebar code is based on the CS 340 starter code available here: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data

Express server side code was adapted based on CS 340 starter code available here: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%200%20-%20Setting%20Up%20Node.js/README.md

Handlebar helper was adapted from a blogpost about Handlebar helpers for outputting JSON: https://www.zshawnsyed.com/2015/04/30/output-json-in-handlebars/