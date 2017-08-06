export const TARGET_HEIGHT = 100;
export const BORDER_OFFSET = 5;
export const MAX_WIDTH = 1000;

export function makeSmaller(image, amount) {
  amount = amount || 1;
  const newHeight = image.height - amount;
  image.width = image.width * (newHeight / image.height);
  image.height = newHeight;

  return image;
}

export function getCumulativeWidth(images) {
  let width = 0;

  for (let i = 0; i < images.length; i++) {
    width += images[i].width;
  }

  width += (images.length - 1) * BORDER_OFFSET;

  return width;
}

export function fitImagesInRow(images) {
  while (getCumulativeWidth(images) > MAX_WIDTH) {
    for (var i = 0; i < images.length; i++) {
      images[i] = makeSmaller(images[i]);
    }
  }

  return images;
}

export function processImages(photos) {
  const processedImages = [];
  for (let i = 0; i < photos.size; i++) {
    let width = parseInt(photos.getIn([i, 'width']), 10);
    const height = parseInt(photos.getIn([i, 'height']), 10);
    const ratio = width / height;
    width = TARGET_HEIGHT * ratio;

    var image = {
      id: photos.getIn([i, 'id']),
      height: TARGET_HEIGHT,
      url: photos.getIn([i, 'url']),
      postedBy: photos.getIn([i, 'postedBy']),
      title: photos.getIn([i, 'title']),
      width
    };
    processedImages.push(image);
  }

  return processedImages;
}

export function buildRows(
  processedImages,
  currentRow = 0,
  currentWidth = 0,
  rows = []
) {
  processedImages.forEach(image => {
    if (currentWidth >= MAX_WIDTH) {
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
