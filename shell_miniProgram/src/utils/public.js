const maxIntrodStrLen = 25

export function handleLongIntroduce(str, max=maxIntrodStrLen) {
    let result = ''
    if (typeof(str) !== 'string') throw new Error('只允许传入字符串')
    if (str.length > max )  result = `${str.substring(0,max)}...`
    else result = str
    return result
}

export function test() {

}