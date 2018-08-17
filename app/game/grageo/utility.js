
// methods associated with performing utilites on shape objects
var Utility = {};

// this method returns a vector pointing to the center of the canvas
Utility.middle = () => {
  return Utility.size().scale(0.5);
}

Utility.random = (min = 0,max = 1) => {
  return Math.random() * (max - min) + min;
}

Utility.randomInt = (min = 0, max = 1) => {
  return Math.round(Utility.random(min,max))
}

Utility.pyth = (v) => {
  return Math.sqrt((v.x * v.x) + (v.y + v.y))
}

// converts @radian to degrees
Utility.degrees = (radian) => {
  return radian*(180.0/Math.PI);
}

// converts @degree to radians
Utility.radians = (degree) => {
  return degree*(Math.PI/180);
}

// pythagorean distance
Utility.dist = (v1,v2) => {
  return Math.sqrt(Math.pow(v2.x-v1.x,2)+Math.pow(v2.y-v1.y,2));
}

module.exports = Utility;
