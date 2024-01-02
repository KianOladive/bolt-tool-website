import React, {useState, useEffect} from 'react';
import api from './api'
import './New_app.css';
import Nav from "./components/navbar"
import Input from "./components/Input"
import darrow from "./static/images/down-arrow.png"
import uarrow from "./static/images/up-arrow.png"
import download_image from "./static/images/download.png"


const App = () => {

  const [imageInput, setImageInput] = useState("")
  const [inputFile, setInputFile] = useState(false)
  const [imageData, setImageData] = useState('')
  const [validImage, setValidImage] = useState(false)
  const [fileName, setFileName] = useState(null)

  const [num, setNum] = useState(null)

  const base64ToDataURI = (base64String) => {
    return `data:image/png;base64,${base64String}`;
  };

  function isNaturalNumber(n) {
    if (Number.isInteger(Number(n)) && Number(n)>0) {
      return true
    }
    return false
  }

  function downloadImage() {
    const base64ToBlob = (base64String) => {
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: 'image/jpeg' }); // Replace 'image/jpeg' with the appropriate MIME type
    };

    const blob = base64ToBlob(imageData);
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'downloaded-image.jpg'; // Specify the desired file name
    // Simulate a click on the link to trigger the download
    link.click();
    // Clean up
    URL.revokeObjectURL(link.href);
  }

  function normalHasError(inp) {
    if ("01".includes(inp) && inp != "") {
      return false
    }
    return true
  }

  function pressRender() {
    var resolution = document.getElementById("resolution").value
    var samples = document.getElementById("samples").value
    var normal = document.getElementById("normal").value
    
    var samplesTooltip = document.getElementById("samples-tooltip")
    var samplesDiv = document.getElementById("samples")
    var normalTooltip = document.getElementById("normal-tooltip")
    var normalDiv = document.getElementById("normal")

    var loadingAnimation = document.getElementById("loader")

    if (isNaturalNumber(samples) && "01".includes(normal)) {

      samplesTooltip.classList.remove("tooltip-visible")
      samplesDiv.classList.remove("error-input-field")
      normalTooltip.classList.remove("tooltip-visible")
      normalDiv.classList.remove("error-input-field")

      loadingAnimation.classList.add("visible-loader")

      var resval;
      if (resolution == "640x480") {
        resval = "1"
      } else if (resolution == "1280x720") {
        resval = "2"
      } else if (resolution == "1920x1080") {
        resval = "3"
      } else if (resolution == "2560x1440") {
        resval = "4"
      } else if (resolution == "3840x2160") {
        resval = "5"
      }
      api.post('/api/dll-test/?integer=' + num + '&integer2=' + resval, {})
        .then(function (response) {
          setImageData(response.data)
          setValidImage(true)
          loadingAnimation.classList.remove("visible-loader")
        })
        .catch(function (error) {
          console.log(error);
        });

    } else {
      // throw validation errors
      if (!isNaturalNumber(samples) && !normalHasError(normal)) { // only samples has error
        samplesTooltip.classList.add("tooltip-visible")
        samplesDiv.classList.add("error-input-field")
        normalTooltip.classList.remove("tooltip-visible")
        normalDiv.classList.remove("error-input-field")
      } 
      
      else if (normalHasError(normal) && isNaturalNumber(samples)) { // only normal has error 
        normalTooltip.classList.add("tooltip-visible")
        normalDiv.classList.add("error-input-field")
        samplesTooltip.classList.remove("tooltip-visible")
        samplesDiv.classList.remove("error-input-field")
      }

      else { // both samples and normal have error
        samplesTooltip.classList.add("tooltip-visible")
        samplesDiv.classList.add("error-input-field")
        normalTooltip.classList.add("tooltip-visible")
        normalDiv.classList.add("error-input-field")
      }
    }
    
  }

  useEffect(() => {
    const inputFile = document.getElementById("upload-usd")
    inputFile.onchange = () => {
      setNum(inputFile.files[0].name.split(".")[0])
      setFileName(inputFile.files[0].name)
      setInputFile(true)
    }
  }, []);


  return (
    <>
      <Nav />
      <div id="main-container">

        <div id="pictures-container">
          <div id="scene-input">
            <div id="scene-input-label"><div className="tooltip">USD or EXR file to process</div>Scene Input *</div>
            <label for="upload-usd">Upload File</label>
            <input type="file" accept=".usd, .exr" id="upload-usd" />
            <div id='input-file-name'>{inputFile ? fileName : "No file chosen."}</div>
          </div>
          <div id="rendered-images-container">
            <div id="rendered-row-1">
              <div className='rendered-image'>{validImage ? <img src={base64ToDataURI(imageData)}></img> : null} <button id="download-image" onClick={downloadImage}><img id="download-icon" src={download_image }></img></button></div>
              <div className='rendered-image'>{validImage ? <img src={base64ToDataURI(imageData)}></img> : null} <button id="download-image" onClick={downloadImage}><img id="download-icon" src={download_image }></img></button></div>
            </div>
            <div id="rendered-row-2">
              <div className='rendered-image'>{validImage ? <img src={base64ToDataURI(imageData)}></img> : null} <button id="download-image" onClick={downloadImage}><img id="download-icon" src={download_image }></img></button></div>
              <div className='rendered-image'>{validImage ? <img src={base64ToDataURI(imageData)}></img> : null} <button id="download-image" onClick={downloadImage}><img id="download-icon" src={download_image }></img></button></div>
            </div>
          </div>
        </div>

        <div id="other-input-fields">
          <div id="fields-container">
            <div id="res-select">
              <label className='resolution-label' for="resolution"><div className="tooltip">Resolution of output .exr files</div>Resolution *</label>
              <select name="resolution" id="resolution">
                <option value="640x480">640x480</option>
                <option value="1280x720">1280x720</option>
                <option value="1920x1080">1920x1080</option>
                <option value="2560x1440">2560x1440</option>
                <option value="3840x2160">3840x2160</option>
              </select>
            </div>
            <Input id="samples" label="Samples *" hover="Number of samples to be generated. Must be an integer greater than 0." />
            <Input id="normal" label="Normal *" hover="Accepted values are 0 (face) or 1 (interpolated)" />
          </div>
          <button id="render" onClick={pressRender}>Render</button>
          <div id="loader">
            <div className='loading-column'></div>
            <div className='loading-column'></div>
            <div className='loading-column'></div>
          </div>
        </div>

      </div>
    </>
  )
}


export default App;

// function isConvertibleToInteger(value) {
//   const intValue = parseInt(value);
//   const floatValue = parseFloat(value);

//   if (!isNaN(intValue) && (floatValue == intValue)) {
//       return true; 
//   } else {
//       return false; 
//   }
// }

// const base64ToDataURI = (base64String) => {
//   return `data:image/png;base64,${base64String}`;
// };

// const App = () => {
//   const [validImage, setValidImage] = useState(false)
//   const [imageData, setImageData] = useState('')
//   const [downArrow, setDownArrow] = useState(true)
//   const [loadingBar, setLoadingBar] = useState(false)

//   function isValidPxrFormat(value) {
//     if (value == "") {
//       return false
//     }
//     if (!isNaN(value)) {
//       return true
//     } 
//     var listedValue = value.split(",")

//     if (listedValue.length == 3 && !isNaN(listedValue[0]) && !isNaN(listedValue[1]) && !isNaN(listedValue[2])) {
//       return true
//     }
//     return false
//   }

//   async function getResponse() {
//     var scene_inp = document.getElementById("input").value
//     var resolution = document.getElementById("resolution").value
//     var resval;
//     if (resolution == "640x480") {
//       resval = "1"
//     } else if (resolution == "1280x720") {
//       resval = "2"
//     } else if (resolution == "1920x1080") {
//       resval = "3"
//     } else if (resolution == "2560x1440") {
//       resval = "4"
//     } else if (resolution == "3840x2160") {
//       resval = "5"
//     }
//     console.log(resolution)
//     var samples = document.getElementById("samples").value
//     var normal = document.getElementById("normal").value
//     if ( !( // check validity of required params
//         isConvertibleToInteger(scene_inp) && 
//         isConvertibleToInteger(samples) &&
//         (normal == "0" || normal == "1") 
//       )) {
//         setValidImage(false);
//     } else {
//       setLoadingBar(true)
//       // loading animation

//       setTimeout(function() {
//         var load = document.getElementById("load")
//         load.classList.add("loader-in")
//         setTimeout(function() {
//           setValidImage(true);
//           setLoadingBar(false)
//           api.post('/api/dll-test/?integer=' + scene_inp + '&integer2=' + resval, {})
//           .then(function (response) {
//             // console.log(typeof(response.data))
//             if (typeof(response.data) == "string") {
//               setValidImage(true)
//               setImageData(response.data)
//             }
//             else{
//               setValidImage(false)
//             }
//           })
//           .catch(function (error) {
//             console.log(error);
//           });
  
//           load.classList.remove("loader-in")
//         }, 2000); 
//       }, 500)

       

      
//     //   var triangles = document.getElementById("triangles").value
//     //   var bvh = document.getElementById("bvh").value
//     //   var camera_pos = document.getElementById("camera_pos").value
//     //   var camera_center = document.getElementById("camera_center").value
//     //   var camera_up = document.getElementById("camera_up").value
//     //   var light = document.getElementById("light").value
//     //   var fov = document.getElementById("fov").val
//     }
  
//     // if (isConvertibleToInteger(scene_inp)) {
//     //   api.post('/api/dll-test/?integer=' + scene_inp, {})
//     //     .then(function (response) {
//     //       // console.log(typeof(response.data))
//     //       if (typeof(response.data) == "string") {
//     //         setValidImage(true)
//     //         setImageData(response.data)
//     //       }
//     //       else{
//     //         setValidImage(false)
//     //       }
//     //     })
//     //     .catch(function (error) {
//     //       console.log(error);
//     //     });
//     // } else {
//     //   setValidImage(false)
//     // }
//   }

//   function accordion() {
//     var optionals = document.getElementById("optional-params")
//     if (downArrow) {
//       optionals.classList.remove("optional-params-off");
//       optionals.classList.add("optional-params-on");
//       setTimeout(() => {  setDownArrow(false) }, 800);
      
//     } else {
//       optionals.classList.add("optional-params-off");
//       optionals.classList.remove("optional-params-on");
//       setDownArrow(true)
//     }
//   }
  
//   return (
//     <div className="container">

//       <div className="bolt-banner">
//         <h1>Bolt Graphics</h1>

//         <div className="banner-buttons">
//           <h3>Blog</h3>
//           <h3>Contact</h3>
//           <h3>About</h3>
//         </div>
//       </div>

//       <div className='content'>
//         <div className='buttons'>
//           <Input id="input" label="Scene input *" />

//           <div className='reso'>
//             <label for="resolution">Resolution *</label>
//             <select name="resolution" id="resolution">
//               <option value="640x480">640x480</option>
//               <option value="1280x720">1280x720</option>
//               <option value="1920x1080">1920x1080</option>
//               <option value="2560x1440">2560x1440</option>
//               <option value="3840x2160">3840x2160</option>
//             </select>
//           </div>

//           <Input id="samples" label="Samples *" />
//           <Input id="normal" label="Normal *" />

//           <div id="optional-params">
//             <Input id="triangles" label="Max Triangles per Mesh" />
//             <Input id="bvh" label="Max BVH Depth" />
//             <Input id="camera_pos" label="Camera Position" />
//             <Input id="camera_center" label="Camera Center" />
//             <Input id="camera_up" label="Camera Up" />
//             <Input id="light" label="Default Light" />
//             <Input id="fov" label="FOV" /> 
//           </div>
        
//           {/* <p id="arrow-label">{downArrow ? "Optional Parameters" : ""}</p> */}
//           <button id="accordion" onClick={accordion} >
//             <img id="arrow" src = { downArrow ? darrow : uarrow } />
//           </button>
//           <button id="render-button" onClick={getResponse} type='submit'>RENDER</button>
//         </div>

            
//         <div className='response'>
//           {loadingBar ? 
//             <div className='loader'>
//               <div className='loader-out'></div>
//               <div className='load' id='load'></div>
//             </div> : null
//           }  

//           {validImage ? <div id="responseImage"><img id="actualImage" src={base64ToDataURI(imageData)}></img></div> : null }
//           {validImage ? <div id="responseImage"><img id="actualImage" src={base64ToDataURI(imageData)}></img></div> : null }
//           {validImage ? <div id="responseImage"><img id="actualImage" src={base64ToDataURI(imageData)}></img></div> : null }
//           {validImage ? <div id="responseImage"><img id="actualImage" src={base64ToDataURI(imageData)}></img></div> : null }
//           {validImage ? null : <div><h1>Invalid input</h1></div>}

//           {/* <div><h1>{validImage ? "This input is valid." : "Invalid input" }</h1></div> */}
//         </div>

//       </div>

//     </div>
//   );
// }

// export default App;
