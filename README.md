# Invoice Generator

<img src="./readmeImages/appOverview.jpg" alt="Picture of Application's main page" width="500px" height="250px">

## Description

I built this application for one of my friends who is a private music teacher. He spends a lot of time putting together invoices for the parents of the students he teachers each month. This program is designed to streamline that process. I also included a way to save and organize a roster of students. This data is present to the user in the form of table to can be easily searched and sorted. I used google oauth to login in the users, firebase to store all the necessary data, and the react-pdf package to create and generate professional invoices that can be downloaded and used as needed. I am using serveral services from AWS (API Gateway, Lambdas, SNS, SES) to handle the email portion of the application which also invoices emails to be sent directly from the application.

The goal of reducing the amout of time need to produce invoices was meet with this project. It use to take my friend about 2 hours to do invoices for all of his students. He can now complete the same task in about 20 minutes (83% improvement).

### View the Project Live <br>

https://outdoor-adventures1.netlify.app/

#### Built With

- Next.js
- Typescript
- [MUI](https://mui.com/)
- Firebase
- AWS (SES, SNS, Lamdbas, API Gateway)
- [NextAuth](https://next-auth.js.org/)
- [@react-pdf/renderer](https://www.npmjs.com/package/@react-pdf/renderer)

## Develope Locally

### Firebase Setup

You will need to create a new project [firebase project](https://firebase.google.com/). They are many docs available online to get you started with this. The main thing we will be doing is firebase is using the firestore database. After creating your firebase project, setup the firestore database. The nice thing about firestore is the nessary collections will be created automatically, all you need to do is be connected the database.

The firebase setup needs to be done before being able to run the app since NEXT-Auth will be leveraging your firestore database for authentication. While you can run the firestore database locally, I prefer to develope with the cloud version as it makes deploment way easier since everything is already integrated.

### Next Auth

After setting up the firebase project with firestore database, you enter all the environment variables seen in the .env.example to get NextAuth working (except the aws env variables are not needed for this part). These environment variables are mostly related the the firebase project and can be found there.

### Next.js

After getting firebase and next auth setup, go ahead and install all the npm packages in the root directory of the project.

`npm install | yarn install ` etc.

To run in development mode, run the following command:

`npm run dev | yarn run dev`;

If everything is setup correctly, the project should run and allow you to login.

### AWS

This is a seperate add on for the email feature. I will need to add these docs later as there is a lot of development that has been done directly in AWS to set this up. The project should work without this, you just won't be able to use the emails page.

## Technical Overview

#### Next JS

#### Redux

I used redux as a tool to help simplify my application. This allow me to send data to child components within the application without have to prop drill down to them and kept the main app component much more readiable.

#### Styled Components

I am familar with using css to style my components, but I wanted to try out styled componets as a way to combine my styling into the componets them selves (without having to have extra css files for styling). After building this project, I really enjoy using styled components. It is very straight forward and offers lots of advantages over simply using plain css for styled your components such as descresing file sizes, allow you to more easily work with variables in your application, and keeping your styling in the same file as your react component. Since it generates unique classnames, you won't have to worry about accidentally styling something in a large application.

#### No Down time

With this application, I handled all asynchronous tasks with loading screens so the user is always engaged with the page. It makes the app appear to work faster and looks more professional.

## Usage

#### Park Search

- This page has a table with all the national parks in the United States. You can search for a specific national park along with using search filters by state and park designation.

<img src="./readmeImages/appOverview.jpg" alt="national park table" width="650px" height="350px">

#### Park Info Page

- Has detailed information on the park you selected including a description, entrance fees, park hours, activites, location, contact info, and images from that park.

<img src="./readmeImages/parkDetail.jpg" alt="Individual park info page" width="650px" height="350px">

## Frontend

[Frontend Github Page](https://github.com/Mark-Mulligan/outdoor-adventures-frontend-v1.0)

## Contact

[My Github](https://github.com/Mark-Mulligan) || mark.mulligan.jr1@gmail.com

#### How to Contact Me

Feel free to reach out to me if you have any questions about this project. You can email me using the email listed above or can go to my github page to view my other projects and portfolio.

© Mark Mulligan 2021 All Rights Reserved.
