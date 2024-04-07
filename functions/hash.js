const bcrypt = require("bcrypt")

const compare = async (userPassword, dbPassword) => {
    let resultCompare = false;

    await bcrypt.compare(userPassword, dbPassword)
        .then(res => {
            resultCompare = res// return true
        })

    return resultCompare
}

module.exports = {
    compare
}