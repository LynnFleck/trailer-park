const UserDAO = require('../services/UserDAO');

class UserController {
  static getAll(req, res) {
    UserDAO.all()
           .then(users => res.status(200).json(users));
  }
  static getOne(req, res) {
    UserDAO.findBy({ id: req.params.id })
           .then(user => res.status(200).json(user));
  }
  static deleteUser(req, res) {
    UserDAO.delete({ id: req.params.id })
           .then(() => res.status(204).end())
           .catch(err => res.status(500).json(err));
  }
}

module.exports = UserController;