const DoubleRegex = /^\d+\.?(\d+)?$/

export function isItNumber(str) 
{
    return DoubleRegex.test(str)
}