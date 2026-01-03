
//DOM element references
const textInput = document.getElementById("text-input");
const charCount = document.getElementById("char-count");
const voiceSelect = document.getElementById("voice-select");
const speakBtn = document.getElementById("speak-btn");
const stopBtn = document.getElementById("stop-btn");
const speedSlider = document.getElementById("speed-slider");
const pitchSlider = document.getElementById("pitch-slider");
const statusNew = document.getElementById("status");
const statusText = document.getElementById("status-text");


// Browser voices system and list of voices
const synth = window.speechSynthesis;
let voices = [];

function loadVoices() {
    voices = synth.getVoices(); //Get the voices from the browser

    if(voices.length === 0){
        return;
    }

 // empty the voice list before adding new voices
voiceSelect.innerHTML = "";


voices.forEach((voice, index) => {
  const option =  document.createElement("option");
  option.value = index;
  option.textContent = `${voice.name} (${voice.lang})`; // Show the voice name and language
  voiceSelect.appendChild(option);
});

console.log(`Loaded ${voices.length} voices`); // Shows number of voices
}


// This runs when the page is ready
function init(){
   loadVoices();
   synth.addEventListener("voiceschanged", loadVoices);
   textInput.addEventListener("input", updateCharCount);
   
   speakBtn.addEventListener("click", speak);
   stopBtn.addEventListener("click", stop);
   
   updateCharCount();
   stopBtn.disabled = true;
}

document.addEventListener("DOMContentLoaded", init);

// Count how many letters are typed
function updateCharCount(){ 
    const count = textInput.value.length;
    charCount.textContent = count;
}


//input event
textInput.addEventListener("input", updateCharCount);

function speak() {
    if(synth.speaking) {
        synth.cancel();
    }
     
  const text = textInput.value.trim();
  if(!text) {
    alert("please enter some text to speak");
    return;
  }  


// Create a speech utterance for the entered text
const utterance = new SpeechSynthesisUtterance(text);

const selectedVoiceIndex = voiceSelect.value;
if(selectedVoiceIndex !== "") {
  utterance.voice = voices[selectedVoiceIndex];
}

// Control how the voice sounds
utterance.rate = parseFloat(speedSlider.value);
utterance.pitch = parseFloat(pitchSlider.value);
utterance.volume = 1.0;

utterance.onstart = () => {
    statusNew.classList.add("speaking");
    statusText.textContent = "Speaking...";
    speakBtn.disabled = true;
    stopBtn.disabled = false;
};

//When speech finishes
utterance.onend =  () => {
    statusNew.classList.remove("speaking");
    statusText.textContent = "Ready";
    speakBtn.disabled = false;
    stopBtn.disabled = true;
};

utterance.onerror = (event) => {
    console.error("Speech synthesis error:", event);
    statusText.textContent = "Error occurred";
    speakBtn.disabled = false;
    stopBtn.disabled = true;
};

synth.speak(utterance);

}

//Stop current speech
function stop() {
 synth.cancel();
 statusNew.classList.remove("speaking");
 statusText.textContent = "Stopped";
 speakBtn.disabled = false;
 stopBtn.disabled = true;
}


