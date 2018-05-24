function getContext(width, height) {
  let canvas = document.createElement("canvas");
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  return canvas.getContext('2d');
};

function getImageData(img) {
  let context = getContext(img.width, img.height);
  context.drawImage(img, 0, 0);
  let imageData = context.getImageData(0, 0, img.width, img.height);
  return imageData;
};

function makeRGB(name) {
  return ['rgb(', name, ')'].join('');
};

function mapPalette(palette) {
  let arr = [];
  for (let prop in palette) { arr.push(frmtPobj(prop, palette[prop])) };
  arr.sort(function (a, b) { return (b.count - a.count) });
  return arr;
};

function fitPalette(arr, fitSize) {
  if (arr.length > fitSize) {
    return arr.slice(0, fitSize);
  } else {
    for (let i = arr.length - 1; i < fitSize - 1; i++) { arr.push(frmtPobj('0,0,0', 0)) };
    return arr;
  };
};

function frmtPobj(a, b) {
  return { name: makeRGB(a), count: b };
}

function colorHex(rgb) {
  var colors = rgb.replace('rgb(', '').replace(')', '').split(',');
  let hexcolors = colors.map((color) => Number(color).toString(16));
  return hexcolors.join('');
}

let PALETTESIZE = 10;

export default function RGBaster(img, opts) {
  opts = opts || {};
  let exclude = opts.exclude || []; // for example, to exclude white and black:  [ '0,0,0', '255,255,255' ]
  let paletteSize = opts.paletteSize || PALETTESIZE;
  let data = getImageData(img).data;
  let colorCounts = {},
    rgbString = '',
    rgb = [],
    colors = {
      dominant: { name: '', count: 0 },
      palette: []
    };
  for (let i = 0; i < data.length; i += 4) {
    rgb[0] = data[i];
    rgb[1] = data[i + 1];
    rgb[2] = data[i + 2];
    rgbString = rgb.join(",");

    if (rgb.indexOf(undefined) !== -1 || data[i + 3] === 0) {
      continue;
    }
    if (exclude.indexOf(makeRGB(rgbString)) === -1) {
      if (rgbString in colorCounts) {
        colorCounts[rgbString] = colorCounts[rgbString] + 1;
      }
      else {
        colorCounts[rgbString] = 1;
      }
    }
  }
  let palette = fitPalette(mapPalette(colorCounts), paletteSize + 1);
  return colorHex(palette[0].name);
};