const onProgress=e=>{const r=e.target.querySelector(".progress-bar");e.target.querySelector(".update-bar").style.width=`${100*e.detail.totalProgress}%`,1===e.detail.totalProgress?r.classList.add("hide"):(r.classList.remove("hide"),0===e.detail.totalProgress&&e.target.querySelector(".center-pre-prompt").classList.add("hide"))};document.querySelector("model-viewer").addEventListener("progress",onProgress);