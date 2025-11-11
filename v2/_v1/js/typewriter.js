
var texts = [
    'Software Engineer',
    'Mechanical Engineer'
  ];
  var currentTextIndex = 0;
  var i = 0;
  var speed = 50;
  
  function typeWriter() {
    if (i < texts[currentTextIndex].length) {
      document.getElementById("typewriter").innerHTML += texts[currentTextIndex].charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    } else {
      // Wait for 1 second and then clear the text to start the next one
      setTimeout(() => {
        i = 0;
        currentTextIndex = (currentTextIndex + 1) % texts.length; // Loop through texts
        document.getElementById("typewriter").innerHTML = ""; // Clear the current text
        typeWriter(); // Start typing the next text
      }, 1000);
    }
  }
  
  function startTypeWriter() {
    // Reset and start typing
    currentTextIndex = 0;
    i = 0;
    document.getElementById("typewriter").innerHTML = ""; // Clear any existing text
    typeWriter();
  }
  
  startTypeWriter();
