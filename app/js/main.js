(function(document, $) {
  'use strict';

  var form = document.forms.namedItem('photoU');
  var image = document.getElementById('lastUploaded');
  var socket = io();

  socket.on('new photo', function(evt) {
    console.log('reload with new image');
    var path = evt.imagePath;
    image.src = path;
  });

  form.addEventListener('submit', function(e) {

    var request = new XMLHttpRequest();
    var data = new FormData(document.forms.namedItem('photoU'));
    request.open('POST', '/api/upload', true);
    request.send(data);
    e.preventDefault();
  });
})(window.document, jQuery);
