function generatePinList(length, width, height) {
  const center = [width / 2, height / 2];
  const radius = width / 2;
  const angleUnit = (Math.PI * 2) / length;

  const pinList = Array(length)
    .fill()
    .map((_, index) => {
      const angle = angleUnit * index - Math.PI / 2; // make pinList[0] at 12 o'clock

      const x = Math.round(center[0] + radius * Math.cos(angle));
      const y = Math.round(center[1] + radius * Math.sin(angle));

      if (x === width) {
        return [x - 1, y];
      }

      if (y === height) {
        return [x, y - 1];
      }

      return [x, y];
    });

  return pinList;
}

function isDotOnLine(dot, start, end) {
  // straight line
  if (end[0] - start[0] === 0) {
    if (dot[0] === end[0]) {
      return true;
    } else {
      return false;
    }
  }

  const slope = (end[1] - start[1]) / (end[0] - start[0]);
  const intercept = start[1] - slope * start[0];

  const blockTopY = dot[1] + 0.5;
  const blockBottomY = dot[1] - 0.5;
  const blockLeftY = slope * (dot[0] - 0.5) + intercept;
  const blockRightY = slope * (dot[0] + 0.5) + intercept;

  if (Math.abs(slope) <= 1) {
    if ((blockLeftY >= blockBottomY && blockLeftY <= blockTopY) || (blockRightY >= blockBottomY && blockRightY <= blockTopY)) {
      return true;
    } else {
      return false;
    }
  } else {
    if (slope > 0) {
      if (blockLeftY > blockTopY || blockRightY < blockBottomY) {
        return false;
      } else {
        return true;
      }
    } else {
      if (blockRightY > blockTopY || blockLeftY < blockBottomY) {
        return false;
      } else {
        return true;
      }
    }
  }
}

function isDone() {
  const colorlist = imageData.data.filter((a, index) => (index + 1) % 4 === 0);
  const score = colorlist.filter(a => a === 254).length / colorlist.length;
  if (score >= 0.9) {
    console.log(score);
    return true
  } else {
    return false
  }
}



function getPointListOnLine(start, end) {
  const pointList = [];
  const movementX = end[0] > start[0] ? 1 : -1;
  const movementY = end[1] > start[1] ? 1 : -1;

  let currentX = start[0];
  let currentY = start[1];

  while (Math.abs(end[0] - currentX) >= 1 || Math.abs(end[1] - currentY) >= 1) {
    pointList.push([currentX, currentY]);
    if (isDotOnLine([currentX + movementX, currentY], start, end)) {
      currentX += movementX;
    } else {
      currentY += movementY;
    }
  }
  pointList.push(end);

  return pointList;
}

function getImageData(imageData, dot) {
  const startIndex = (dot[1] * imageData.width + dot[0]) * 4; // rgba
  return [
    imageData.data[startIndex],
    imageData.data[startIndex + 1],
    imageData.data[startIndex + 2],
    imageData.data[startIndex + 3]
  ];
}

function reduceImageData(start, end) {
  const dotList = getPointListOnLine(start, end);

  dotList.forEach(dot => {
    const startIndex = (dot[1] * imageData.width + dot[0]) * 4; // rgba
    // imageData.data[startIndex] += 50;

    // if (imageData.data[startIndex] > 255) {
    imageData.data[startIndex] = 255;
    imageData.data[startIndex + 1] = 255;
    imageData.data[startIndex + 2] = 255;
    imageData.data[startIndex + 3] = 254;
    // }
  });
}

function getLineScore(start, end) {
  const dotList = getPointListOnLine(start, end);
  // const lengthscore = Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2);

  dotScoreList = dotList.map(dot => {
    const color = getImageData(imageData, dot); // r channel

    const dotScore = 255 - (color[0] + color[1] + color[2]) / 3; // darker is higher

    return dotScore;
  });

  const score = dotScoreList.reduce((a, b) => a + b, 0) / dotScoreList.length;

  return score;
}

function isLineDrawn(startPinIndex, endPinIndex) {
  const lineFound = lineList.find(line => {
    if ((startPinIndex === line[0] && endPinIndex === line[1]) || (startPinIndex === line[1] && endPinIndex === line[0])) {
      return true;
    }
    return false;
  });

  return Boolean(lineFound);
}

function drawLine(start, end) {
  const line = plate.line().stroke({ width: 0.5, opacity: 0.6 });
  line.plot([start, end]);
}

let plate;
let image;
let imageData;
let pinList;
let lineList = [];
let startPinIndex = 0;

function draw() {
  let endPinIndex;
  let highestScore = 0;

  pinList.forEach((pin, index) => {
    if (startPinIndex === index || isLineDrawn(startPinIndex, index)) {
      return;
    }

    const score = getLineScore(pinList[startPinIndex], pin);

    if (score > highestScore) {
      endPinIndex = index;
      highestScore = score;
    }
  });

  if (!isDone()) {
    document.getElementsByTagName('h1')[0].innerHTML = '【' + startPinIndex + ',' + endPinIndex + '】';
    lineList.push([startPinIndex, endPinIndex]);
    drawLine(pinList[startPinIndex], pinList[endPinIndex]);
    reduceImageData(pinList[startPinIndex], pinList[endPinIndex]);
    startPinIndex = endPinIndex;
    setTimeout(() => {
      draw();
    }, 1);
  } else {
    const canvas = $("canvas")[0];
    const ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);
  }
}

document.body.onclick = function () {
  draw();
}

function init() {
  const canvas = $("canvas")[0];
  const ctx = canvas.getContext("2d");
  ctx.arc(300, 300, 300, 0, 2 * Math.PI);
  ctx.clip();
  ctx.drawImage(image, 0, 0);
  imageData = ctx.getImageData(0, 0, 600, 600);
  imageData.data = imageData.data.map((d, index) => {
    if ((index + 1) % 4 === 0) {
      if (imageData.data[index - 1] + imageData.data[index - 2] + imageData.data[index - 3] <= 300) {
        return 0
      } else {
        return d
      }
    } else {
      return d
    }
  });
  // console.log(imageData.data.slice(0, 100));

  pinList = generatePinList(100, 600, 600);
}

$(() => {
  plate = SVG("plate").size(600, 600);

  image = new Image();
  image.src = "./example/3333.jpg";
  image.onload = init;
});
