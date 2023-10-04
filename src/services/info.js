export const generateUserErrorInfo = (user) => {
    return `Una o mas propiedades estan incompletas o no son validas.
    Lista de propiedades requeridas:
    * first_name : necesita ser un String, se recibio ${user.first_name !== undefined ? user.first_name : 'no definido'}
    * last_name : necesita ser un String, se recibio ${user.last_name !== undefined ? user.last_name : 'no definido'}
    * email : necesita ser un String, se recibio ${user.email !== undefined ? user.email : 'no definido'}
    * age : necesita ser un String, se recibio ${user.age !== undefined ? user.age : 'no definido'}`
}

export const generatePurchaserErrorInfo = (purchaser) => {
    return `Una propiedad esta incompleta o no es valida:
    * purchaser : necesita ser un String, se recibio ${purchaser !== undefined ? purchaser : 'no definido'}`
}

export const generateUpdateErrorInfo = (title,description,code,price,status,stock,category) => {
    return `Una o mas propiedades estan incompletas o no son validas.
    Lista de propiedades requeridas:
    * title : necesita ser un String, se recibio ${title !== undefined ? title : 'no definido'}
    * description : necesita ser un String, se recibio ${description !== undefined ? description : 'no definido'}
    * code : necesita ser un String, se recibio ${code !== undefined ? code : 'no definido'}
    * price : necesita ser un Number, se recibio ${price !== undefined ? price : 'no definido'}
    * status : necesita ser un Boolean, se recibio ${status !== undefined ? status : 'no definido'}
    * stock: necesita ser un Number, se recibio ${stock !== undefined ? stock : 'no definido'}
    * category : necesita ser un String, se recibio ${category !== undefined ? category : 'no definido'}`
}
export const generateCreateErrorInfo = (title,description,code,price,status,stock,category) => {
    return `Una o mas propiedades estan incompletas o no son validas.
    Lista de propiedades requeridas:
    * title : necesita ser un String, se recibio ${title !== undefined ? title : 'no definido'}
    * description : necesita ser un String, se recibio ${description !== undefined ? description : 'no definido'}
    * code : necesita ser un String, se recibio ${code !== undefined ? code : 'no definido'}
    * price : necesita ser un Number, se recibio ${price !== undefined ? price : 'no definido'}
    * status : necesita ser un Boolean, se recibio ${status !== undefined ? status : 'no definido'}
    * stock: necesita ser un Number, se recibio ${stock !== undefined ? stock : 'no definido'}
    * category : necesita ser un String, se recibio ${category !== undefined ? category : 'no definido'}`
}

export const generatePasswordErrorInfo = (user) => {
    return `Una o mas propiedades estan incompletas o no son validas.
    Lista de propiedades requeridas:
    * email : necesita ser un String, se recibio ${user.email !== undefined ? user.email : 'no definido'}
    * password : necesita ser un String, se recibio ${user.password !== undefined ? user.password : 'no definido'}`
}

export const generateCidErrorInfo = (cid) => {
    return `El id del carrito no es valido, se recibio: ${cid}`
}

export const generatePidErrorInfo = (pid) => {
    return `El id del producto no es valido, se recibio: ${pid}`
}