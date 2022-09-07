

const calculatorformula = (rate, duration, weight) => {

  return  Math.round((rate*2.2*2.2) * (duration/60) * weight)

}

export const isUserLogin = (currentUser) => {
  return currentUser?.username != null;
}


export default calculatorformula;