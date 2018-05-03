app = require('./topar.js');

l1 = app.parse_ast(`[1, 2, 3, -6]`, 'test_lists')
console.log(l1)

l2 = app.parse_ast(`[
]`, 'test_lists')
console.log(l2)

l3 = app.parse_ast(`
- 23
- 45
- 23.4
`, 'test_lists')
console.log(l3)

l4 = app.parse_ast(`
- 23
- 45
- - 100 
  - 200
- 88
`, 'test_lists')
console.log(l4)

l5 = app.parse_ast(`
- 23
- 45
- - toto 
  - cw200
  - "tata"
- 88
`, 'test_lists')
console.log(l5)
