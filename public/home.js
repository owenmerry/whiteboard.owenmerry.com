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
      console.log('eneded up in here', encodeURI(chatInput.value) !== '');
      return false;
    }

    const website = window.location.href + 'room/' + encodeURI(chatInput.value);
    window.location.href = website;
  }
  

})();