import bcrypt from "bcrypt";

export const hashValue = async(value:string,salt:number = 10) => {
    return bcrypt.hash(value,salt)
}

export const compareHash = async (value:string, hashedValue: string) => {
    return await bcrypt.compare(value, hashedValue)
}