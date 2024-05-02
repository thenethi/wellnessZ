# Title

    WellnessZ Assignment - Nodejs Task

## Objective

    To make a Rest API using Nodejs + SQL

## Tech Stack

    Used Nodejs, SQL, express.js

## Completion Instructions

### Functionality

#### Must Have

    * Make a model of Posts (with fields: title, desc, tag, image...)
    * Create an endpoint to get all posts and it should be configured with the following options:
      • An Option to sort, and paginate the data
      • An Option keyword that filters the posts that contains that keyword either in the title or description
      • An Option Tag that gives us the posts associated with that particular tag.
    * Create an endpoint that Inserts a POST in the posts collection.
      • Upload the image to cloud services (AWS S3, Cloudinary or others...)

### Good to Have
    * If possible, deploy the solution into production.  
    * The code should be clean and maintainable.
    * Share the POSTMAN collection of the same with examples attached to each api(s)

### Submission Instructions

#### Must Have

    * Host the code on a GitHub repository.
    * Deploy the application on a free hosting service like Railways, onrender.

## Resources

### APIs
    /posts

### Third-party packages

    sequelize, cloudinary

## Setup Instructions
     * run npm install to install the dependencies
     * run node index.js to start the server
