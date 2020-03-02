function Autocomplete(rootEl, options = {}) {
  this.rootEl = rootEl;

  this.options = {
    queryCount: 10,
    data: [],
    ...options
  };

  // a React-esque state storage
  this.state = {
    selection: {
      index: null,
      text: null
    }
  };

  // a React-esque ref storage
  this.ref = {
    inputEl: null,
    listUlEl: null
  };

  // store key
  const KEYCODE = {
    UP: 38,
    DOWN: 40,
    ENTER: 13
  };

  this.getResults = (query, data) => {
    if (!query) return [];

    // Filter for matching strings
    return data.filter(item => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });
  };

  this.onQueryChange = query => {
    new Promise(resolve => {
      const { getData } = this.options;
      if (getData && typeof getData === "function") {
        getData(query, updatedData => {
          this.options.data = updatedData;
          resolve(updatedData);
        });
      } else {
        resolve();
      }
    })
      .then(updatedData => {
        // store data into results
        let results = this.getResults(query, updatedData || this.options.data);
        results = results.slice(0, this.options.queryCount);

        this.updateDropdown(results);
      })
      .catch(error => {
        console.error("an erorr occurred", error);
      });
  };

  this.updateDropdown = results => {
    this.ref.listUlEl.innerHTML = "";
    this.ref.listUlEl.appendChild(this.createResultsEl(results));
  };

  this.createResultsEl = results => {
    const fragment = document.createDocumentFragment();
    results.forEach(result => {
      const el = document.createElement("li");
      el.classList.add("result");
      el.setAttribute("tabindex", "-1");
      el.textContent = result.text;

      // Value passed to onSelect
      el.addEventListener("click", () => {
        const { onSelect } = this.options;
        if (typeof onSelect === "function") onSelect(result.value);
        // set input value on click
        this.ref.inputEl.value = result.value;
      });

      fragment.appendChild(el);
    });
    return fragment;
  };

  this.createQueryInputEl = () => {
    const inputEl = document.createElement("input");
    inputEl.setAttribute("type", "search");
    inputEl.setAttribute("name", "query");
    inputEl.setAttribute("autocomplete", "off");

    inputEl.addEventListener("input", event =>
      this.onQueryChange(event.target.value)
    );

    return inputEl;
  };

  this.handleKeyDown = event => {
    if (
      event &&
      event.target &&
      (event.keyCode === KEYCODE.DOWN ||
        event.keyCode === KEYCODE.UP ||
        event.keyCode === KEYCODE.ENTER)
    ) {
      event.preventDefault();
      const results = event.target
        .closest(".query-container")
        .querySelectorAll(".result");

      if (results.length) {
        const currentlySelectedIndex =
          this.state.selection.index &&
          [...results].indexOf(results[this.state.selection.index]);

        if (event.keyCode === KEYCODE.DOWN) {
          const isLastIndex = currentlySelectedIndex === results.length - 1;
          if (currentlySelectedIndex >= 0 && !isLastIndex) {
            this.setSelection(currentlySelectedIndex + 1);
          } else if (!currentlySelectedIndex || !isLastIndex) {
            this.setSelection(0);
          }
        } else if (event.keyCode === KEYCODE.UP && currentlySelectedIndex > 0) {
          this.setSelection(currentlySelectedIndex - 1);
        }
        results[this.state.selection.index].focus();

        // set input value on mousedown
        this.ref.inputEl.value = results[this.state.selection.index].innerHTML;

        if (event.keyCode === KEYCODE.ENTER) {
          results[this.state.selection.index].click();
        }
      }
    }
  };

  this.setSelection = value => {
    return (this.state.selection.index = value);
  };

  this.init = () => {
    // input
    this.ref.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.ref.inputEl);
    // results
    this.ref.listUlEl = document.createElement("ul");
    this.ref.listUlEl.classList.add("results");
    this.rootEl.appendChild(this.ref.listUlEl);
    // attach event listener to root element
    this.rootEl.addEventListener("keydown", this.handleKeyDown);
  };

  this.init();
}

export default Autocomplete;
