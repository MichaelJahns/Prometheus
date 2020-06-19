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
  exports.roleArrayToString = roleArrayToString;