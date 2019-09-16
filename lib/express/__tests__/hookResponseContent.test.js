const hookResponseContent = require("../hookResponseContent")

it("Should wrap response to get final body - content is string", () => {
  return new Promise(resolve => {
    const res = {
      write: jest.fn(),
      end: jest.fn()
    }
    hookResponseContent(res, (err, data, encoding) => {
      expect(err).toBeNull()
      resolve()
    })
    res.write("Foo")
    res.end("Bar")
  })
})

it("Should wrap response to get final body - content is buffer", () => {
  return new Promise(resolve => {
    const res = {
      write: jest.fn(),
      end: jest.fn()
    }
    hookResponseContent(res, (err, data, encoding) => {
      expect(err).toBeNull()
      resolve()
    })
    res.write(Buffer.from("Foo"))
    res.end(Buffer.from("Bar"))
  })
})

it("Should wrap response to get final body - content is undefined", () => {
  return new Promise(resolve => {
    const res = {
      write: jest.fn(),
      end: jest.fn()
    }
    hookResponseContent(res, (err, data, encoding) => {
      expect(err).not.toBeNull()
      resolve()
    })
    res.write(undefined)
    res.end(undefined)
  })
})
