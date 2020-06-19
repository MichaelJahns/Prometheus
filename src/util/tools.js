function roleArrayToString(roles) {
    let roleString = "";
    for (let i = 0; i < roles.length; i++) {
      roleString += roles[i].name;
      if (i !== roles.length - 1) {
        roleString += ", "
      } else {
        roleString += "."
      }
    }
    return roleString;
  }

  function randomNumberInRange(range) {
    return Math.floor(Math.random() * Math.floor(range));
  }

module.exports.randomNumberInRange = randomNumberInRange;
module.exports.roleArrayToString = roleArrayToString;