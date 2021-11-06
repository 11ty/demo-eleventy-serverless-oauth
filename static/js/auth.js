function generateCsrfToken() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8) // eslint-disable-line
    return v.toString(16)
  })
}

function parse(value, delimiter) {
  var obj = {};
  if(value) {
    var s = value.split(delimiter);
    for(var i=0; i < s.length; i++) {
      var v = s[i].split("=");
      if(v.length > 0) {
        obj[v[0].trim()] = decodeURIComponent(v[1].trim()).replace(/\+/g, ' ');
      }
    }
  }
  return obj;
}

class Hash {
  static parse(hash) {
    if (!hash) {
      return {};
    }
    return parse(hash.replace(/^#/, ''), "&");
  }
  
  // Does not add a history entry.
  static remove() {
    const { history, location } = window;
    history.replaceState("", "", `${location.pathname}${location.search}`)
  }
}

class OAuth {
  constructor() {
    this.response = Hash.parse(window.location.hash);
    console.log( "Response", this.response );

    Hash.remove();

    // Protect against csrf (cross site request forgery https://bit.ly/1V1AvZD)
    if(this.response.csrf) {
      let csrfKey = this.response.csrf;
      let isCsrfSaved = localStorage.getItem(csrfKey);
      if(isCsrfSaved) {
        console.log( "Matches saved CSRF token." );
        // Clean up csrfToken
        localStorage.removeItem(csrfKey);
      } else {
        alert("Token invalid. Please try to login again");
        this.redirectToLogin();
        return;
      }
    }

    console.log( "Not expired!" );
    this.initLoggedIn();
  }

  beforeLogin() {
    let csrfToken = generateCsrfToken();

    // Set csrf token in localStorage
    localStorage.setItem(csrfToken, 'true');
    console.log( "Adding to storage", csrfToken );

    // Also set the csrf token in the form
    let input = document.querySelector("form[data-netlify-oauth] input[name='_auth_csrf']");
    if(input) {
      input.value = csrfToken;
    }
  }


  initLoggedIn() {
    if(this.response.state === "success") {
      alert("Saved.");
    }
  }

  redirectToLogin() {
    window.location.href = "/";
  }
}

let oauthInst = new OAuth();
let form = document.querySelector("form[data-netlify-oauth]");

form.addEventListener("submit", e => {
  oauthInst.beforeLogin();
})