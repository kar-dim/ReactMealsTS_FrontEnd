# ReactMealsTS_FrontEnd
My own implementation (Frontend) of Maximilian's [React Meals](https://www.udemy.com/course/react-the-complete-guide-incl-redux/) (as of 2023).

It is a web app written in React (Vite with TypeScript) based on Maximillian's React Meals but enhanced with some extra functionality:

- A Backend is implemented [Link](https://github.com/kar-dim/ReactMealsTS_BackEnd). There is a new functionality for calling the backend services in order to fetch and update information (orders, update dishes, etc).
- Login system implemented, with the help of Auth0. 
- Role based with the help of Auth0. "Admin" role users have extra functionality, like updating the Menu/Dishes and Users' information by calling the backend services.
- Configured for Vercel (in 'production' mode, ```num run build```) 
