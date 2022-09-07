

const calculatorformula = (rate, duration, weight) => {

  return  Math.round((rate*2.2*2.2) * (duration/60) * weight)

}

export const fatFormula = (weight, height, age) => {
  const heightM = height/100;
  const bmi = weight / Math.pow(heightM, 2);
  return Math.round(1.20 * bmi + 0.23 * age - 16.2) + "%";
}

export const isUserLogin = (currentUser) => {
  return currentUser?.username != null;
}


export default calculatorformula;