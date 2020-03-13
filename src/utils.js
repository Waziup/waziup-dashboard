
groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

  
//download the QR code in the canvas
downloadQR = (canvas, line1, line2) => {
  
  //create another canvas, larger with some text
  var canvas2 = document.createElement('canvas');
  canvas2.height = canvas.height + 30;
  canvas2.width = canvas.width;
  var ctx2 = canvas2.getContext('2d');
  ctx2.font = "11px Arial";
  ctx2.fillStyle = "#FFFFFF";
  ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
  ctx2.fillStyle = "#000000";
  ctx2.drawImage(canvas, 0, 0);
  ctx2.fillText(line1, 10, 250);
  ctx2.fillText(line2, 10, 270);
  
  //convert the canvas to image, create a itemporary link and click it to trigger the download
  const pngUrl = canvas2.toDataURL("image/png").replace("image/png", "image/octet-stream");
  let downloadLink = document.createElement("a");
  downloadLink.href = pngUrl;
  downloadLink.download = "QRCode.png";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
