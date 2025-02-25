export const validateField = (field : any) => {
    if (field.length < 3) {
        return false
    }
    return true
}