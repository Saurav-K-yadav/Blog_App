const avg = require('../utils/for_testing').average

describe('average', () => {
    test('is only one', () => {
        expect(avg([1])).toBe(1)
    })
    
    test('if many values', () => {
        expect(avg([1,2,3,4,5,6])).toBe(3.5)
    })
    test('if empty', () => { 
        expect(avg([])).toBe(0)
    })
})