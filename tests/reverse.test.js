const reverse = require('../utils/for_testing').reverse

test('reverse of a', () => {
    const result = reverse('a')

    expect(result).toBe('a')
})

test('reverse of react', () => {
    const result = reverse('react')

    expect(result).toBe('tcaer')
})

test('reverse of releveler', () => {
    const result = reverse('releveler')

    expect(result).toBe('releveler')
})

test('Palindrome of react', () => {
    const res = reverse('react')
    expect(res).toBe('tcaer')
})

test('Palindrome of react', () => {
    const res = reverse('react')
    expect(Object.is(res,'tcaer')).toBe(true)
})