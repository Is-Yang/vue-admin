

export function getBase64Image(img) { // 获取base64图片转化为 url， 裁剪功能后传给后端的url
  debugger;
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  var dataURL = canvas.toDataURL("image/" + ext);
  return dataURL;
}

export function downloadBase64Img(url, imgName, ext) { // 下载base64图片
  let blob = convertBase64UrlToBlob(url, ext);
  let downloadValue = `${imgName}.${ext}`;
  this.downloadBlobFn(blob, downloadValue); // 下载执行
}

export function downloadBlobFn(blob, downloadValue) {  // blob 格式下载
  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = downloadValue; // downloadValue为下载文件的名字
  a.textContent = "export data";
  a.style.textIndent = "-1000px";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadUrlFn(url, fileName, ext) { // url 格式下载
  var a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.${ext}`; // 下载文件的名字  ext格式
  a.textContent = "export data";
  a.style.textIndent = "-1000px";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function convertBase64UrlToBlob(urlData, ext) {
  // base64转blob
  let bytes = window.atob(urlData.split(",")[1]);
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  let i = 0;
  for (i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: `image/${ext}`
  });
}

export function downloadFileDeal(item, url_attr='url', callback){ // 文件格式处理 item 传进来的格式，url_attr是对象那个属性是url
  if(!item || (item && typeof item != 'object')){
    if(typeof callback === 'function'){
      callback('没有该信息');
    }
    return;
  }
  const url = item[url_attr] ? item[url_attr] : '';
  let fileName,ext;
  if(url){
    fileName = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
    ext = url.substring(url.lastIndexOf(".") + 1);
  }
  if("jpg/jpeg/gif/png/bmp".indexOf(ext) > -1) { // 裁剪功能后下载的图片
    var image = new Image();
    image.crossOrigin = "";
    image.src = url;
    let url2 = this.getBase64Image(image); // 取不到宽
    setTimeout(() => {
      url2 = this.getBase64Image(image); // 重新取图片的宽度
      debugger;
      this.downloadBase64Img(url2, fileName, ext);
    }, 500);
  } else {
    // 非图片
    downloadUrlFn(url, fileName, ext);
  }

}

export function downloadPoster(item, url_attr='url', callback) { // 下载海报
  if(!item || (item && typeof item != 'object')){
    if(typeof callback === 'function'){
      callback('没有该信息');
    }
    return;
  }
  const url = item[url_attr] ? item[url_attr] : '';
  let fileName,ext;
  if(url){
    fileName = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
    ext = url.substring(url.lastIndexOf(".") + 1);
  }
  this.downloadUrlFn(url, fileName, ext);
}