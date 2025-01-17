export interface UserData {
    name: string
    email: string
    password: string
    avatar? : any 
  } 

  export interface GroupData{
    name : string
    adminId : string
    members : string[]
}