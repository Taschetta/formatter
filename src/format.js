
const ID_REGEX = /`/g
const QUALIFIED_REGEX = /\./g
const CHARS_REGEX = /[\0\b\t\n\r\x1a\"\'\\]/g
const CHARS_MAP    = {
  '\0'   : '\\0',
  '\b'   : '\\b',
  '\t'   : '\\t',
  '\n'   : '\\n',
  '\r'   : '\\r',
  '\x1a' : '\\Z',
  '"'    : '\\"',
  '\''   : '\\\'',
  '\\'   : '\\\\'
};

export function escape_id(value, forbid_qualified) {
  
  if(Array.isArray(value))
    return value.flatMap(escape_id).join(', ')
  
  if(typeof value === "function")
    value = value()

  value = String(value)
  
  value = value.replace(ID_REGEX, '``')

  if(!forbid_qualified)
    value = value.replace(QUALIFIED_REGEX, '`.`')

  return '`' + value + '`'
}

export function escape(value) {
  if(value === undefined || value === null) {
    return 'NULL'
  }

  const escape_string = (value) => {
    const matches = Array.from(value.matchAll(CHARS_REGEX))

    matches.forEach(([key]) => {
      value = value.replace(key, CHARS_MAP[key])
    })
    
    return "'" + value + "'"
  }

  const object_to_values = (value) => {
    values = Object.entries(value)

    values = values.map(([key, value]) => {
      return `${escape_id(key)} = ${escape(value)}`
    })
    
    values = values.join(', ')
    
    return values
  }
  
  switch (typeof value) {
    case 'boolean':
      return value ? 'true' : 'false'
    case 'number':
      return String(value)
    case 'object':
      return object_to_values(value)
    default:
      return escape_string(value)
  }
}