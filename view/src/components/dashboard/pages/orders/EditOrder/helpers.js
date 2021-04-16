exports.generateKey = (pre) => {
  return `${ pre }_${ new Date().getTime() }`;
}

