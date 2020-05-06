'use strict';

(function() {

  const form = document.getElementById('myform');
  const chatInput = document.getElementById('chatInput');

  form.addEventListener('submit', onSubmit, false);

  function onSubmit(event) {
    if (event) { event.preventDefault(); }
    console.log('run scripts');
    const website = window.location.href + 'chat/' + encodeURI(chatInput.value);
    window.location.href = website;
  }
  

})();