let imgElements = [];
let imgCount = document.querySelector('span').innerText.split('/')[1];
let imgtimer = setInterval(() => {
  let ie = document.querySelectorAll("#img_list > div > img[width]");
  ie.forEach(img => {
    img.removeAttribute("width");  // Remove the width attribute
    img.style.maxWidth = "95vw";
    img.style.height = "100vh";  // Set style.height to 100vh
    imgElements.push(img);
  });
  if(imgCount == imgElements.length){
    clearInterval(imgtimer);
  };
},100);


let currentIndex = 0;
const imageCountDisplay = document.createElement("div");
imageCountDisplay.style.position = "fixed";
imageCountDisplay.style.top = "10px";
imageCountDisplay.style.right = "10px";
imageCountDisplay.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
imageCountDisplay.style.padding = "5px";
imageCountDisplay.style.borderRadius = "5px";
document.body.appendChild(imageCountDisplay);
function updateImageCount() {
  imageCountDisplay.textContent = `${currentIndex + 1}/${imgElements.length} (${imgCount})`;
}
document.addEventListener("keydown", function (event) {
  if (event.key === "w" || event.key === "s" || event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    if (event.key === "w" || event.key === "ArrowUp") {
      currentIndex = Math.max(0, currentIndex - 1);
    } else if (event.key === "s" || event.key === "ArrowDown") {
      currentIndex = Math.min(imgElements.length - 1, currentIndex + 1);
    }
    const targetPosition = imgElements[currentIndex].offsetTop;
    window.scrollTo({
      top: targetPosition
    });
    updateImageCount();
  }
});
updateImageCount();
