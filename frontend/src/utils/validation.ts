const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
const emailRegex =   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ;
const nameRegex = /^[a-zA-Z\s'-]{4,50}$/;

export const isValidPassword =  (password : string) =>{
   return passwordRegex.test(password)
}

export const isValidEmail = (email:string) =>{
    return emailRegex.test(email)
}


export const isValidName = (name:string) =>{
    return nameRegex.test(name) 
}


