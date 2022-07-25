const fileInput = document.querySelector(".file-input"),
  filterOptions = document.querySelectorAll(".filter button"),

  filterName = document.querySelector(".filter-info .name"),
  filterValue = document.querySelector(".filter-info .value"),

  filterSlider = document.querySelector(".slider input"),
  rotateOptions = document.querySelectorAll(".rotate button"),

  previewImg = document.querySelector(".preview-img img"),
  saveImgBtn = document.querySelector(".save-img"),

  resetFilterBtn = document.querySelector(".reset-filter"),
  chooseImgBtn = document.querySelector(".choose-img");

//setting default values
let brightness = "100",
  saturation = "100",
  inversion = "0",
  grayscale = "0";

let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

//applying the changes being made to the img by using style and its properties
const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};


//set the varible to get the value of the input, validate in case that 
//there's not file;

//grab the src of the img and create a URL object passing the file you're
//choosing to it

//remove the disable css class once the file loads
const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;

  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    document.querySelector(".container").classList.remove("disable");
  });
};


//giving an event click to each option, removing and adding the active class as you click
//and saving the induvidual values when using the slider
filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");

//changing the name of the options as you click as saving its value individually 
    filterName.innerText = option.innerText;

    //if option.id === "" assign the value to the designed variable.
    if (option.id === "brightness") {
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

//actually changing the value of each option by assigning the variable
// to the value of the slider
const updateFilter = () => {

 // changing the static 100% to the value of the slider.
  filterValue.innerHTML = `${filterSlider.value}`;

  //grabing the active option by its css style
  const selectedFilter = document.querySelector(".filter .active");


  //if the active option id === 'something' set the slider value to
  //the designed variables
  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }

  //this is what changes the picture, updateFilter function
  //is changing the value and giving it to the designed variables
  //but the applyFilter function is the one grabbing these variables
  //that are recieving the values and applying it to the picture
  //by grabbing the img and chaging its style properties.
  applyFilter();
};


// on click if option.id === 'something' rotates, or flip.
rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }

  //this is what changes the picture, updateFilter function
  //is changing the value and giving it to the designed variables
  //but the applyFilter function is the one grabbing these variables
  //that are recieving the values and applying it to the picture
  //by grabbing the img and chaging its style properties.
    applyFilter();
  });
});

//reseting the value
const resetFilter = () => {
  brightness = "100";
  saturation = "100";
  inversion = "0";
  grayscale = "0";
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click();
  applyFilter();
};

//create and save the img
const saveImage = () => {
  //create canvas  
  const canvas = document.createElement("canvas");
  //get 2d of the img
  const ctx = canvas.getContext("2d");
  //the the natural measurements of the img
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;
  //filter the canvas with the dynamic changes on the variables
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  //adds a translation transformation to the current picture
  ctx.translate(canvas.width / 2, canvas.height / 2);
  //if rotate is different than 0, rotate 2
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  
  //saving the flips of the img
  ctx.scale(flipHorizontal, flipVertical);

  //saving the properties of the img
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  //creating an link element
  const link = document.createElement("a");
  //name of the downloaded file
  link.download = "image.jpg";
  //grabbing the link of the a element and setting it equal to the canvas
  //url which is toDataUrl
  link.href = canvas.toDataURL();
  //download on click
  link.click();
};


//save the img
saveImgBtn.addEventListener("click", saveImage);
//reset the options
resetFilterBtn.addEventListener("click", resetFilter);
//update the filter values
filterSlider.addEventListener("input", updateFilter);

//loading the image was the second step.
fileInput.addEventListener("change", loadImage);

// first step was connecting the button with the input, so you choose an image when you clik at
//the button you choose, not the default one, and you have to write hidden on the input html.
chooseImgBtn.addEventListener("click", () => fileInput.click());
