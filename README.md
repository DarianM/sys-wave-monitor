# SysWaveMonitor

Real-time application designed to monitor and visualize the RAM usage of your personal computer in real-time. Built with React on the client-side and Node.js with Express on the server-side, uses WebSockets to provide seamless real-time updates. The project displays the total RAM usage and free RAM available in a chart, similar to a task manager, and also shows the RAM usage for the most heavy processes in a sortable and filterable table.
<img src="https://imgur.com/a/ER7yTIn" alt="SysWave">

## Introduction

The primary purpose was to serve as a learning project. It was created to refresh concepts in various web development and implementation technologies, particullary in:
- **Sorting and filtering data in React. hooks**.
- **Understanding Docker and Docker Compose; images, containers, deployment, volumes**.
- **real time data communication using WebSockets**.
- **Building a basic Node.js server using Express, Middlewares, Express Routes, MVC**.

## Features

- **Real-time RAM Monitoring:** Displays a real-time chart of total RAM used and free RAM available, updated every second.
  - **Adjustable Timespan:** The chart allows to adjust the timespan to display RAM usage over the last 60 seconds, 300 seconds, or from the time when the app was first accessed.
- **Processes RAM Usage Table:** Lists the current machine processes by RAM usage in a sortable and filterable table, refreshed every second.
- **Interactive UI:** The table supports sorting in ascending or descending order and filtering based on user input.

## Technologies Used

- **React:** For building the user interface.
- **Node.js:** server-side logic and data processing.
- **Express:**
- **WebSockets:** For real-time data transmission between the server and client, ensuring that both the RAM usage chart and the process table refresh every second;
- **Docker:** To containerize the application.
- **Docker Compose:** For defining and running multi-container Docker applications.

## Running the Project

## using Docker
``` bash
docker-compose up --build
```
The application will be accessible at port :5173 locally.

## locally
```
npm run start
```
in the root, after npm i, this will start both server&client concurrently locally