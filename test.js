let state = {
  token : null
}
console.log(state)

// function setToken (newToken) {
//   state.token = newToken
// }

// setToken("abc123")

const dispatch = (action) =>{
  if(action.type === "SET_TOKEN"){
    state.token = action.payload
  }
}

dispatch({
  type:"SET_TOKEN",
  payload:"abc1234"
})

console.log(state)