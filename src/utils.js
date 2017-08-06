const TARGET_HEIGHT = 200;
const BORDER_OFFSET = 5;

function makeSmaller(image, amount) {
  amount = amount || 1;
  const newHeight = image.height - amount;
  image.width = image.width * (newHeight / image.height);
  image.height = newHeight;

  return image;
}

function getCumulativeWidth(images) {
  let width = 0;

  for (let i = 0; i < images.length; i++) {
    width += images[i].width;
  }

  width += (images.length - 1) * BORDER_OFFSET;

  return width;
}

function fitImagesInRow(images, maxWidth) {
  while (getCumulativeWidth(images) > maxWidth) {
    for (var i = 0; i < images.length; i++) {
      images[i] = makeSmaller(images[i]);
    }
  }

  return images;
}

export function processImages(photos) {
  return photos.map(photo => {
    const aspectRatio = photo.width / photo.height;
    photo.width = TARGET_HEIGHT * aspectRatio;
    photo.height = TARGET_HEIGHT;
    return photo;
  });
}

export function buildRows(processedImages, maxWidth) {
  let currentRow = 0;
  let currentWidth = 0;
  let rows = [];
  processedImages.forEach(image => {
    if (currentWidth >= maxWidth) {
      currentRow++;
      currentWidth = 0;
    }

    if (!rows[currentRow]) {
      rows[currentRow] = [];
    }

    rows[currentRow].push(image);
    currentWidth += image.width;
  });
  return rows;
}

export function normalizeRows(rows, maxWidth) {
  for (let i = 0; i < rows.length; i++) {
    rows[i] = fitImagesInRow(rows[i], maxWidth);

    const difference = maxWidth - getCumulativeWidth(rows[i]);
    const amountOfImages = rows[i].length;

    if (amountOfImages > 1 && difference < 10) {
      const addToEach = difference / amountOfImages;
      for (let n = 0; n < rows[i].length; n++) {
        rows[i][n].width += addToEach;
      }
      rows[i][rows[i].length - 1].width +=
        maxWidth - getCumulativeWidth(rows[i]);
    }
  }
  return rows;
}
