import { describe, it, expect } from "vitest"

import { format, escape, escape_id } from '../src/format.js'

describe("when the escape_id(value, forbid_qualified) function is called", () => {

  describe("and it recibes a string", () => {
    
    it("quotes it", () => {
      expect(escape_id('id')).toEqual('`id`')
    })

    describe("and it contains escapes", () => {
      
      it("quotes them", () => {
        expect(escape_id('i`d')).toEqual('`i``d`')
      })
      
    })

    describe("and it contains separators", () => {
      
      it("quotes them", () => {
        expect(escape_id('id1.id2')).toEqual('`id1`.`id2`')
      })

      describe("and forbid_qualified is set to true", () => {
      
        it("does not quote the separators", () => {
          expect(escape_id('id1.id2', true)).toEqual('`id1.id2`')
        })
        
      })

    })

    describe("and it contains escapes and separators", () => {
      
      it("quotes them", () => {
        expect(escape_id('id`1.i`d2')).toEqual('`id``1`.`i``d2`')
      })

      describe("and forbid_qualified is set to true", () => {
      
        it("does not quote the separators", () => {
          expect(escape_id('id`1.i`d2', true)).toEqual('`id``1.i``d2`')
        })
        
      })
      
    })

  })

  describe("and it recibes a number", () => {
    
    it("quotes the value", () => {
      expect(escape_id(42)).toEqual('`42`')
    })

  })
  
  describe("and it recibes an object", () => {
    
    it("quotes the value", () => {
      expect(escape_id({})).toEqual('`[object Object]`')
    })
    
    describe("and it contains a toString propertie", () => {

      it("calls it", () => {
        expect(escape_id({ toString: () => 'foo' })).toEqual('`foo`')
      })

    })
  })

  describe("and it recibes a function", () => {
    
    it("calls it", () => {
      expect(escape_id(() => 'foo' )).toEqual('`foo`')
    })

  })

  describe("and it recibes an array", () => {
    
    it("turns it into a list", () => {
      expect(escape_id(['a','b','c'])).toEqual('`a`, `b`, `c`')
    })

    describe("and the array is nested", () => {
      
      it("flattens it", () => {
        expect(escape_id(['a', ['b', ['c']]])).toEqual('`a`, `b`, `c`')
      })
      
    })
    
  })
  
})

describe("when the escape(value) function is called", () => {
  
  describe("when it recibes undefined", () => {
    
    it("turns it to NULL", () => {
      expect(escape(undefined)).toEqual('NULL')
    })

  })
  
  describe("when it recibes null", () => {
    
    it("turns it to NULL", () => {
      expect(escape(null)).toEqual('NULL')
    })

  })
  
  describe("when it recibes a boolean", () => {
    
    it("turns it to a string", () => {
      expect(escape(true)).toEqual('true')
      expect(escape(false)).toEqual('false')
    })

  })
  
  describe("when it recibes a number", () => {
    
    it("turns it to a string", () => {
      expect(escape(5)).toEqual('5')
    })

  })

  describe("when it recibes an object", () => {
    
    it("turns it to a key value pair", () => {
      expect(escape({ a: 'b', c: 'd' })).toEqual("`a` = 'b', `c` = 'd'")
    })

    it("ignores its functions", () => {
      expect(escape({ a: 'b', c: () => {} }), "`a` = 'b'");
    })

  })

  describe("when it recibes a string", () => {
    
    it("quotes it", () => {
      expect(escape('Super')).toEqual("'Super'")
    })

    it("escapes \0", () => {
      expect(escape('S\bup\0er\0')).toEqual("'S\\bup\\0er\\0'")
    })

    it('escapes \b', () => {
      expect(escape('Sup\ber')).toEqual("'Sup\\ber'")
      expect(escape('Super\b')).toEqual("'Super\\b'")
    })
  
    it('escapes \n', () => {
      expect(escape('Sup\ner')).toEqual("'Sup\\ner'")
      expect(escape('Super\n')).toEqual("'Super\\n'")
    })
  
    it('escapes \r', () => {
      expect(escape('Sup\rer')).toEqual("'Sup\\rer'")
      expect(escape('Super\r')).toEqual("'Super\\r'")
    })
  
    it('escapes \t', () => {
      expect(escape('Sup\ter')).toEqual("'Sup\\ter'")
      expect(escape('Super\t')).toEqual("'Super\\t'")
    })
  
    it('escapes \\', () => {
      expect(escape('Sup\\er')).toEqual("'Sup\\\\er'")
      expect(escape('Super\\')).toEqual("'Super\\\\'")
    })
  
    it('replaces \u001a (ascii 26) with \\Z', () => {
      expect(escape('Sup\u001aer')).toEqual("'Sup\\Zer'")
      expect(escape('Super\u001a')).toEqual("'Super\\Z'")
    })
  
    it('escapes single quotes', () => {
      expect(escape('Sup\'er')).toEqual("'Sup\\'er'")
      expect(escape('Super\'')).toEqual("'Super\\''")
    })
  
    it('escapes double quotes', () => {
      expect(escape('Sup"er')).toEqual("'Sup\\\"er'")
      expect(escape('Super"')).toEqual("'Super\\\"'")
    })
    
  })

})
