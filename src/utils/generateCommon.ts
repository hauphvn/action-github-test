export const generateSimpleId = () =>{
    return '_'+Math.random().toString(36).substring(2,11);
}