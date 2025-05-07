'use strict'

const UserModel = require('../models/user.models')

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 1,
    username: 1,
    phone: 1,
    role: 1
  }
}) => {
  return await UserModel.findOne({ email }).select(select).lean()
}

module.exports = {
  findByEmail
}
