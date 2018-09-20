var methods = {};

methods.random = (min = 0,max = 1) => {
  return Math.random() * (max - min) + min;
}

methods.randomInt = (min = 0,max = 1) => {
  return Math.round(methods.random(min,max));
}

methods.pyth = (v) => {
  return Math.sqrt((v.x * v.x) + (v.y + v.y))
}

methods.pyth = (v1,v2) => {
  return Math.sqrt(Math.pow(v2.x-v1.x,2)+Math.pow(v2.y-v1.y,2));
}

methods.degree = (radian) => {
  return radian*(180.0/Math.PI);
}

methods.radian = (degree) => {
  return degree*(Math.PI/180);
}

methods.roundTo = (val,places) => {
  return parseFloat((val).toFixed(places));
}

module.exports = methods;
