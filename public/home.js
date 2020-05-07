'use strict';

(function() {

  const form = document.getElementById('myform');
  const chatInput = document.getElementById('chatInput');
  const errorMessage = document.getElementById('error');

  form.addEventListener('submit', onSubmit, false);

  function showError (){
    chatInput.classList.add('error-input');
    errorMessage.classList.remove('error-hide');
  }

  function onSubmit(event) {
    if (event) { event.preventDefault(); }

    //validate 
    if (encodeURI(chatInput.value) === ''){
      showError();
      return false;
    }

    const website = window.location.href.split('?')[0] + 'room/' + encodeURI(chatInput.value.toLowerCase());
    window.location.href = website;
  }
  

})();