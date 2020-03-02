/* eslint-disable no-new */
import Autocomplete from "./Autocomplete";
import usStates from "./us-states";
import "./main.css";

// US States
const data = usStates.map(state => ({
  text: state.name,
  value: state.abbreviation
}));
new Autocomplete(document.getElementById("state"), {
  data,
  onSelect: stateCode => {
    console.log("selected state:", stateCode);
  }
});

// Github Users
new Autocomplete(document.getElementById("gh-user"), {
  data: [],
  getData: (query, callback) => {
    const endpoint = `https://api.github.com/search/users?q=${query}`;
    const request = new XMLHttpRequest();
    request.open("GET", endpoint, true);
    request.responseType = "json";
    request.onload = () => {
      if (
        request.readyState === XMLHttpRequest.DONE &&
        request.status === 200
      ) {
        callback(
          request.response.items.map(item => ({
            text: item.login,
            value: item.login
          }))
        );
      }
    };
    request.send();
  },
  onSelect: ghUserId => {
    console.log("selected github user id:", ghUserId);
  }
});
