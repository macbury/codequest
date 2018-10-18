export default class SwitchesRepository {
  constructor(db) {
    this.collection = db.collection('switches')
  }

  save(switches) {
    //insert all switches
    //https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/
  }

  all() {

  }
}
