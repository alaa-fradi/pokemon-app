![Pokemon Ball](src/assets/International_Pokémon_logo.svg.png)
# Pokémon Search App
A web application built with React, Apollo Client, and Tailwind CSS for searching and filtering Pokémon by their stats.

## Features
- Search Pokémon by name
- Filter Pokémon by different stats (HP, Attack, Defense, etc.)
- Apply min and max value filters for each stat
- Responsive layout for mobile and desktop views

## Technologies Used
- **React** for the frontend
- **Apollo Client** for interacting with the GraphQL API
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **GraphQL**: A query language for APIs, used to request data from the PokeAPI.

### Data Consumption from PokeAPI

The data used in this application is fetched from the **PokeAPI** via **GraphQL** queries. Apollo Client is used to handle the interaction between the front-end and the GraphQL API, ensuring efficient fetching of data such as Pokémon types, stats, and other attributes.

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/en/) (version 14.x or higher)

### 1. Clone the repository
   git clone https://github.com/your-username/pokemon-search-app.git
### 2. Install dependencies
Install all necessary dependencies using npm or yarn:
npm install
### 3. Start the development server
Run the app in development mode:
npm start
