'use strict';


//let workingCanvas = document.getElementById('workingCanvas');
let workingCanvasWidth = snapShotWidth * 2;
let workingCanvasHeight = snapShotHeight;
workingCanvas.width = workingCanvasWidth;
workingCanvas.height = workingCanvasHeight;
summedCanvas.width = snapShotWidth;
summedCanvas.height = snapShotHeight;
differenceCanvas.width = snapShotWidth;
differenceCanvas.height = snapShotHeight;

const myVideoInputs = [];


const cleanUp = (whichCamera) => {
    try {
        const stream = whichCamera.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        whichCamera = null;
    } catch (error) {
        console.log(error);
    }
}


const getDevicesInfo = async () => {
    await navigator.mediaDevices.enumerateDevices()
        .then(results => {
            //console.log(results);
            results.forEach(result => {
                if (result.kind === 'videoinput') {
                    //console.log(result);
                    myVideoInputs.push(result);
                }
            })
        })
        .catch(error => {
            console.log(error);
        });
}


const startCamera = async (myVideoInput, whichCamera) => {
    if (myVideoInput === undefined) { console.log('myVideoInput is undefined'); return; }
    await navigator.mediaDevices.getUserMedia( { 
            video: { 
                width: streamWidth, 
                height: streamHeight,
                deviceId: myVideoInput.deviceId,
            }
        })
        .then(stream => {
            whichCamera.srcObject = stream;
        })
        .catch(error => {
            console.log(error);
        });
}

const captureImage = (camera, canvas) => {
    canvas.width = snapShotWidth; canvas.height = snapShotHeight;
    canvas.getContext('2d').drawImage(camera, 0, 0, snapShotWidth, snapShotHeight);
    return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
}

const putImage = (image, canvas) => {
    canvas.getContext('2d').putImageData(image, 0, 0);
}


const invert = (canvas) => {
    let data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i=0; i<data.length; i+=4) {
            data[i] = 255 - data[i];
            data[i+1] = 255 - data[i+1];
            data[i+2] = 255 - data[i+2];
            //data[i+3] = 255;
        }
        let newImage = new ImageData(new Uint8ClampedArray(data), canvas.width, canvas.height);
        canvas.getContext('2d').putImageData(newImage, 0, 0);
}

const increaseContrast = (data, value) => {
    const high = data + value;
    if (high >= 255) return data;
    return high;
}

const decreaseContrast = (data, value) => {
    const low = data - value;
    if (low <= 0) return data;
    return low;
}

const incOrDecContrast = (data, value) => {
    if (data > 128) { return increaseContrast(data, value); } else { return decreaseContrast(data, value); }
}

const contrast = (canvas, value) => {
    let data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i=0; i<data.length; i+=4) {
        data[i] = incOrDecContrast(data[i], value);
        data[i+1] = incOrDecContrast(data[i+1], value);
        data[i+2] = incOrDecContrast(data[i+2], value);
    }
    let newImage = new ImageData(new Uint8ClampedArray(data), canvas.width, canvas.height);
    canvas.getContext('2d').putImageData(newImage, 0, 0);
}

const increaseBrightness = (data, value) => {
    const high = data + value;
    if (high >= 255) return data;
    return high;
}

const brightness = (canvas, value) => {
    let data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i=0; i<data.length; i+=4) {
        data[i] = increaseBrightness(data[i], value);
        data[i+1] = increaseBrightness(data[i+1], value);
        data[i+2] = increaseBrightness(data[i+2], value);
    }
    let newImage = new ImageData(new Uint8ClampedArray(data), canvas.width, canvas.height);
    canvas.getContext('2d').putImageData(newImage, 0, 0);
}

const grayscale = (canvas) => {
    let data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i=0; i<data.length; i+=4) {
        let max = Math.max(data[i], data[i+1], data[i+2]);
        data[i] = max;
        data[i+1] = max;
        data[i+2] = max;
    }
    let newImage = new ImageData(new Uint8ClampedArray(data), canvas.width, canvas.height);
    canvas.getContext('2d').putImageData(newImage, 0, 0);
}

const makeOverlappedSummedImage = (canvas1, canvas2, overlap) => {
    let data1 = canvas1.getContext('2d').getImageData(canvas1.width-overlap, 0, overlap, canvas1.height).data;
    let data2 = canvas2.getContext('2d').getImageData(0, 0, overlap, canvas2.height).data;
    let data = [];
    let total = 0;
    for (let i=0; i<data1.length; i+=4) {
        data[i] = Math.max(data1[i],data2[i]);
        data[i+1] = Math.max(data1[i+1],data2[i+1]);
        data[i+2] = Math.max(data1[i+2],data2[i+2]);
        let sum = data[i] + data[i+1] + data[i+2];
        total += sum;
        data[i+3] = 255;
    }
    let newImage = new ImageData(new Uint8ClampedArray(data), overlap, canvas1.height);
    sumVal.innerHTML = Math.round(total/data1.length);
    return newImage;
}

const makeOverlappedDifferenceImage = (canvas1, canvas2, overlap) => {
    let data1 = canvas1.getContext('2d').getImageData(canvas1.width-overlap, 0, overlap, canvas1.height).data;
    let data2 = canvas2.getContext('2d').getImageData(0, 0, overlap, canvas2.height).data;
    let data = [];
    for (let i=0; i<data1.length; i+=4) {
        data[i] = 255 - Math.abs(data1[i]-data2[i]);
        data[i+1] = 255 - Math.abs(data1[i+1]-data2[i+1]);
        data[i+2] = 255 - Math.abs(data1[i+2]-data2[i+2]);
        data[i+3] = 255;
    }
    let newImage = new ImageData(new Uint8ClampedArray(data), overlap, canvas1.height);
    return newImage;
}


const getNumDiff = (canvas, overlap) => {
    let data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    let total = 0;
    for (let i=0; i<data.length; i+=4) {
        total += 255 - data[i];
        total += 255 - data[i+1];
        total += 255 - data[i+2];
    }
    return total/(data.length*60);
}

const mergeImagesRightToLeft = (leftCanvas, rightCanvas, rightPos) => {
    let image1 = leftCanvas.getContext('2d').getImageData(0, 0, leftCanvas.width, leftCanvas.height);
    let image2 = rightCanvas.getContext('2d').getImageData(0, 0, rightCanvas.width, rightCanvas.height);

    workingCanvas.getContext('2d').putImageData(image1, 0, 0);
    workingCanvas.getContext('2d').putImageData(image2, rightPos.x, rightPos.y);

    // does right image overlap left image?
    if (leftCanvas.width > rightPos.x) {
        let overlap = leftCanvas.width -  rightPos.x;
        let overlapSummedImg = makeOverlappedSummedImage(leftCanvas, rightCanvas, overlap);
        workingCanvas.getContext('2d').putImageData(overlapSummedImg, rightPos.x - overlap, rightPos.y);
        summedCanvas.getContext('2d').putImageData(overlapSummedImg, 0 , 0);
        let overlapDifferenceImg = makeOverlappedDifferenceImage(leftCanvas, rightCanvas, overlap);
        differenceCanvas.getContext('2d').putImageData(overlapDifferenceImg, 0 , 0);
        numDiff.value = (getNumDiff(differenceCanvas, overlap) * 100).toFixed(2);
        numDiffVal.innerHTML = numDiff.value;
        allNumDiffs[(overlap - rightCanvas.width)] = numDiff.value;
    }
}

const eraseSumAndDiffCanvases = () => {
    summedCanvas.getContext('2d').fillStyle = '#FFFFFF';
    summedCanvas.getContext('2d').fillRect(0, 0, summedCanvas.width, summedCanvas.height);
    differenceCanvas.getContext('2d').fillStyle = '#FFFFFF';
    differenceCanvas.getContext('2d').fillRect(0, 0, differenceCanvas.width, differenceCanvas.height);
}


const startAllCameras = async () => {
    await getDevicesInfo();
    startCamera(myVideoInputs[0], camera1);
    startCamera(myVideoInputs[1], camera2);
    startCamera(myVideoInputs[2], camera3);
    allSnapShots.style.display = 'block';
}

const stopAllCameras = () => {
    cleanUp(camera1);
    cleanUp(camera2);
    cleanUp(camera3);
    players.style.display = 'none';
    allSnapShots.style.display = 'none';
}

stopAllCameras();
getDevicesInfo();
