
var Map = require("collections/map");

class ClientCollection extends Map {

  constructor(){
    super();

    // linear array for iterating over clients
    this.clientArray = new Array()

    // single operation map for finding client elements
    // this.clientMap = new Object()
    this.clientMap = new Map()

  }

  // this method is for applying a method to all clients
  map(callback){
    // iterating over all clients in array list
    for(let client of this.clientArray)
      // passing client into the array list
      callback(client);
  }

  add(key,client){

    if(key && client){

      // adding client key value to cliens map
      this.clientMap.set(key,client)

      // appends client to Array
      this.clientArray.push(client);

    }

  }

  // removing a client from both collections
  remove(key){
    // simply invoking cut without returning its element
    this.cut(key)
  }

  // this method simply invokes remove but also returns the object
  cut(key){

    let oldClient = null;

    // checking both key string is valid ( by existing currently )
    if(key){

      // cloning object
      oldClient =  this.clientMap.get(key);

      // assuming copy is not volatile and will remain after removing
      // from subsequent objects
      if(oldClient) {

        // deleting client from array collection
        this.clientArray.removeByValue(oldClient)

        // deleting from map object
        this.clientMap.delete(key);

      }

    }

    // returing cut item in method call
    return oldClient;

  }

  // O(1) complexity fetch
  get(key){
    // returning client from key
    if(key) return this.clientMap.get(key)
  }

  // this method returns true if a client ( based off of the given key)
  // exists
  exists(key){

    // if key is valid and client object exists, return true;
    if(key && this.clientMap.get(key)) return true;

    // otherwise return false
    return false;
  }


  // this method takes the key of a desired collection and another colllection
  // and copies it over
  migrate(key,otherClientCollection){

    // cut client from other collection
    let c = otherClientCollection.cut(key);

    // if it exists, then add the client to this collection ( ip and object )
    if(c) this.add(c.ip,c);

  }

  // this method will copy clients from other client connection to here
  migrateAll(otherClientCollection){


    // iterating over given collections clients
    otherClientCollection.map((client) => {

      // adding client to collection
      this.add(
        // where other collection has client ( by ip )
        otherClientCollection.cut(client.ip),client
      )

    })

  }

  // this method will migrate clients over if a condition has been met
  migrateAllIf(otherClientCollection,condition,then){

    // iterating over given collections clients
    otherClientCollection.map((client) => {

      // given condition
      if(condition(client)){

        if(then) then(client);

        // migrating client from other collection to this one
        this.migrate(client.ip,otherClientCollection)

      }
    })

  }

  // this method prints out the client object at the given key
  show(key,property = null){
    // checking if key is valid
    if(key){
      // fetching potential client
      let c = this.clientMap.get(key)
      // if client found from key and property provided
      if(c && property) console.logDD('CLIENT\'S',`Key ${key} : Client [ ${property} ] - ${c[property]}`);
      // if client found from key display found client
      if(c) console.logDD('CLIENT\'S',`Key ${key} : Client ${c}`);
    }
  }

  // this method prints out all the client objects at the given key
  showAll(property = null){
    // iteraing over all keys in client map
    // for(let key in this.clientMap){
      // this runs the granular show method with both parameters ( nulled property behaviour is redundent but
      // reads clearly )
      // this.show(key,property);
    // }
  }

  // this method outputs the client array length ( aka number of clients in this collection)
  size(){
    return this.clientArray.length;
  }

}

// exporting to module
module.exports = ClientCollection;
