exports.generateKey = (prefix) => {
  return `${ prefix }_${ new Date().getTime() }`;
}

exports.giveKey = (data, keyName, prefix) => {
  if (data?.[keyName]) return data[keyName]

  return data[keyName] = this.generateKey(prefix)
}