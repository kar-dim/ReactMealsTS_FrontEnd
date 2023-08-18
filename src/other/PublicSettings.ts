export const Settings = {
    auth0_domain : "dev-f0vakdckhtwh0dl8.us.auth0.com",
    auth0_clientId: "lUYQ4bVv26qAc2y7fK1jw9zXenl9sw5a",
    auth0_audience: "https://jimmys/api",
    frontend_url: import.meta.env.VITE_FRONTEND_URL,
    //backend_url: "http://localhost:5179",
    backend_url: "https://solely-useful-grouse.ngrok-free.app"
};

export const ApiRoutes = {
    GetDishes: "api/Dishes/GetDishes",
    GetUsers: "api/Users/GetUsers",
    Order: "api/Dishes/Order",
    GetUserOrders: "api/Dishes/GetUserOrders",
    AddDish: "api/Dishes/AddDish",
    UpdateDish: "api/Dishes/UpdateDish",
    UpdateUser: "api/Users/UpdateUser",
    DeleteDish: "api/Dishes/DeleteDish",
    DeleteUser: "api/Users/DeleteUser"
}

export const OtherRoutes = {
    dishImages : "dishimages"
}