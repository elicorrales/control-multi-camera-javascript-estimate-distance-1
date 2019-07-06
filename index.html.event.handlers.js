'use strict';

let streamWidth = document.getElementById('streamWidth').value;
let streamHeight = document.getElementById('streamHeight').value;
let snapShotWidth = document.getElementById('snapShotWidth').value;
let snapShotHeight = document.getElementById('snapShotHeight').value;

const doChangeStreamWidth = (input) => {
    if (input.value !== undefined && input.value != '') {
        cleanUp(camera1);
        cleanUp(camera2);
        cleanUp(camera3);
        streamWidth = document.getElementById('streamWidth').value;
        streamHeight = document.getElementById('streamHeight').value;
    }
}

const doChangeStreamHeight = (input) => {
    if (input.value !== undefined && input.value != '') {
        cleanUp(camera1);
        cleanUp(camera2);
        cleanUp(camera3);
        streamWidth = document.getElementById('streamWidth').value;
        streamHeight = document.getElementById('streamHeight').value;
    }
}

const doChangeSnapShotWidth = (input) => {
    if (input.value !== undefined && input.value != '') {
        snapShotWidth = document.getElementById('snapShotWidth').value;
        snapShotHeight = document.getElementById('snapShotHeight').value;
        differenceCanvas.width = snapShotWidth;
        differenceCanvas.height = snapShotHeight;
        summedCanvas.width = snapShotWidth;
        summedCanvas.height = snapShotHeight;
        workingCanvas.width = snapShotWidth * 2;
        workingCanvas.height = snapShotHeight;
    }
}

const doChangeSnapShotHeight = (input) => {
    if (input.value !== undefined && input.value != '') {
        snapShotWidth = document.getElementById('snapShotWidth').value;
        snapShotHeight = document.getElementById('snapShotHeight').value;
        differenceCanvas.width = snapShotWidth;
        differenceCanvas.height = snapShotHeight;
        summedCanvas.width = snapShotWidth;
        summedCanvas.height = snapShotHeight;
        workingCanvas.width = snapShotWidth * 2;
        workingCanvas.height = snapShotHeight;
    }
}

const doChangeWorkingCanvasWidth = (input) => {
    if (input.value !== undefined && input.value != '') {
        workingCanvasWidth = document.getElementById('workingCanvasWidth').value;
        workingCanvasHeight = document.getElementById('workingCanvasHeight').value;
        workingCanvas.width = workingCanvasWidth;
        workingCanvas.height = workingCanvasHeight;
    }
}

const doChangeWorkingCanvasHeight = (input) => {
    if (input.value !== undefined && input.value != '') {
        workingCanvasWidth = document.getElementById('workingCanvasWidth').value;
        workingCanvasHeight = document.getElementById('workingCanvasHeight').value;
        workingCanvas.width = workingCanvasWidth;
        workingCanvas.height = workingCanvasHeight;
    }
}

const doGetDevicesInfo = () => {
    stopAllCameras();
    getDevicesInfo();
}


const doStartCamera = (button) => {
    players.style.display = 'block';
    const id = button.id;
    switch (id) {
        case 'startCamera1':
                startCamera(myVideoInputs[0], camera1);
                break;
        case 'startCamera2':
                startCamera(myVideoInputs[1], camera2);
                break;
        case 'startCamera3':
                startCamera(myVideoInputs[2], camera3);
                break;
        case 'startAllCameras':
                startAllCameras();
                break;
    }
}

const doStopAllCameras = () => {
    stopAllCameras();
}

let snapShot1;
let snapShot2;
let snapShot3;
const doCaptureSnapShot = (button) => {

    brightness1.value = 0;
    brightness2.value = 0;
    brightness3.value = 0;
    contrast1.value = 0;
    contrast2.value = 0;
    contrast3.value = 0;

    const id = button.id;
    switch (id) {
        case 'capture1':
                snapShot1 = captureImage(camera1, canvas1);
                break;
        case 'capture2':
                snapShot2 = captureImage(camera2, canvas2);
                break;
        case 'capture3':
                snapShot3 = captureImage(camera3, canvas3);
                break;
        case 'captureAll':
                snapShot1 = captureImage(camera1, canvas1);
                snapShot2 = captureImage(camera2, canvas2);
                snapShot3 = captureImage(camera3, canvas3);
                break;
    }
}

const doBrightness = (slider) => {
    const id = slider.id;
    let value = parseInt(slider.value);
    switch (id) {
        case 'brightness1':
                brightness(canvas1, value);
                break;
        case 'brightness2':
                brightness(canvas2, value);
                break;
        case 'brightness3':
                brightness(canvas3, value);
                break;
    }

}

const doContrast = (slider) => {
    const id = slider.id;
    let value = parseInt(slider.value);
    switch (id) {
        case 'contrast1':
                contrast(canvas1, value);
                break;
        case 'contrast2':
                contrast(canvas2, value);
                break;
        case 'contrast3':
                contrast(canvas3, value);
                break;
        case 'contrastAll':
                contrast(canvas1, value);
                contrast(canvas2, value);
                contrast(canvas3, value);
                break;
    }

}

const doInvert = (button) => {

    const id = button.id;
    switch (id) {
        case 'invert1':
                invert(canvas1);
                break;
        case 'invert2':
                invert(canvas2);
                break;
        case 'invert3':
                invert(canvas3);
                break;
    }

}

const doGrayscale = (button) => {
    const id = button.id;
    switch (id) {
        case 'grayscale1':
                grayscale(canvas1);
                break;
        case 'grayscale2':
                grayscale(canvas2);
                break;
        case 'grayscale3':
                grayscale(canvas3);
                break;
    }
}

const doRevert = (button) => {
    const id = button.id;
    switch (id) {
        case 'revert1':
                putImage(snapShot1, canvas1);
                brightness1.value = 0;
                contrast1.value = 0;
                break;
        case 'revert2':
                putImage(snapShot2, canvas2);
                brightness2.value = 0;
                contrast2.value = 0;
                break;
        case 'revert3':
                putImage(snapShot3, canvas3);
                brightness3.value = 0;
                contrast3.value = 0;
                break;
    }

}


let   leftCanvasToMerge;
let   rightCanvasToMerge;
const rightCanvasPos = {x:0, y:0};
let prevMoveVal = parseInt(mover.value);
let diffValAndOverlapforEachMove = {};
let maxOverlap = 0;
const doMergeSnapShots = (button) => {

    workingCanvas.style.display = 'block';

    mover.value = 0;
    prevMoveVal = parseInt(mover.value);
    rightCanvasPos.x = 0;
    rightCanvasPos.y = 0;
    diffValAndOverlapforEachMove = {};
    maxOverlap = 0;

    eraseSumAndDiffCanvases();

    stopAllCameras();

    const id = button.id;
    switch (id) {
        case 'merge1and2':
                leftCanvasToMerge = canvas1;
                rightCanvasToMerge = canvas2;
                rightCanvasPos.x = workingCanvas.width - canvas2.width;
                break;
        case 'merge2and3':
                leftCanvasToMerge = canvas2;
                rightCanvasToMerge = canvas3;
                rightCanvasPos.x = workingCanvas.width - canvas3.width;
                break;
        case 'merge1and3':
                leftCanvasToMerge = canvas1;
                rightCanvasToMerge = canvas3;
                rightCanvasPos.x = workingCanvas.width - canvas3.width;
                break;
    }

    mergeImagesRightToLeft(leftCanvasToMerge, rightCanvasToMerge, rightCanvasPos);
}

let allNumDiffs = {};
const doStartingMergePosition = () => {
    workingCanvas.style.display = 'none';
    differenceVsOverlapCanvas.style.display = 'none';
    allNumDiffs = {};
    mover.value =  -rightCanvasToMerge.width;
    doMove(mover);
}
const doAutoMergeSnapShots = () => {
    workingCanvas.style.display = 'none';
    differenceVsOverlapCanvas.style.display = 'none';
    allNumDiffs = {};
    mover.value =  -rightCanvasToMerge.width;
    let startingMoverValue = parseInt(mover.value);
    for (let i=startingMoverValue; i > -400; i--) {
        mover.value =  i;
        doMove(mover);
    }
    doShowDifferenceVsOverlapChart();
}

const doMove = (slider) => {

    let value = parseInt(slider.value);

    let delta = Math.abs(value - prevMoveVal);
    if (value < prevMoveVal) { // moved left
        rightCanvasPos.x -= delta;
    } else {                   // moved right
        rightCanvasPos.x += delta;
    }
    prevMoveVal = value;
    mergeImagesRightToLeft(leftCanvasToMerge, rightCanvasToMerge, rightCanvasPos);
}


const doShowCaptureArea = () => {
    allSnapShots.style.display = 'block';
}

const doShowWorkingCanvas = () => {
    workingCanvas.style.display = 'block';
}

const doShowDifferenceVsOverlapChart = () => {

    const labels = [];
    const data = [];
    Object.keys(allNumDiffs).forEach(key => {
        labels.push(key);
        data.push(allNumDiffs[key]);
    });

    const ctx = differenceVsOverlapCanvas.getContext('2d');
    const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        //labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        labels,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(155, 200, 200)',
            borderColor: 'rgb(255, 99, 132)',
            //data: [0, 10, 5, 2, 20, 30, 45]
            data
        }]
    },

    // Configuration options go here
    options: {}
});

    differenceVsOverlapCanvas.style.display = 'block';
}