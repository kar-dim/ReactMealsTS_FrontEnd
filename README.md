This is a custom frontend implementation of Maximilian Schwarzmüller's [React Meals](https://www.udemy.com/course/react-the-complete-guide-incl-redux/) project (as of 2023), built with **React**, **Vite**, and **TypeScript**.

## Enhancements & Features

This version extends the original project with additional functionality:

- **New Backend Integration**  
  A backend service is available here: [ReactMealsTS_BackEnd](https://github.com/kar-dim/ReactMealsTS_BackEnd)  
  It provides API endpoints for managing orders, dishes, and users.

- **Authentication & Authorization**  
  - Integrated with **Auth0** for secure login.
  - **Role-based access control** is implemented:
    - Regular users can place orders.
    - Users with the `"Admin"` role can also edit the menu and manage users via backend services.

- **Deployment**  
  - May be configured for **Vercel** deployment.
  - To build for production:

    ```bash
    npm run build
    ```

## Tech Stack

- React
- TypeScript
- Vite
- Auth0
- REST API (via custom backend)

# UI
![1](https://github.com/user-attachments/assets/d319d7ba-7b57-42b4-9a76-652dd0e5984b)

<p align="center">
  <img src="https://github.com/user-attachments/assets/b4b02663-dc55-4a06-938e-8949710e89a3">
</p>

![3](https://github.com/user-attachments/assets/1ca81f81-0c45-41ad-a0c1-d627abc48957)
![4](https://github.com/user-attachments/assets/05499ee2-b374-425b-a8a9-d34bbec0aed6)
![5](https://github.com/user-attachments/assets/75d9a995-5792-4f10-a63f-035b1b82d099)
