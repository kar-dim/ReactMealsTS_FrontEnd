//Represents a logged in user, with data returned by "auth0 idToken claims". email is already included by default as claim
//but the rest are included in the idToken (user_metadata) in the auth0 on-login action (which can be undefined in theory, but should NOT be
//because they are mandatory in the signup process)
interface IAuth0User {
    email: string,
    name: string | undefined,
    last_name: string | undefined,
    address: string | undefined
}