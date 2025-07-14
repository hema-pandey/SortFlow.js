const barsContainer = document.getElementById("bars-container");
const generateBtn = document.getElementById("generate-array");
const sortBtn = document.getElementById("start-sort");
const algorithmSelect = document.getElementById("algorithm-select");
const speedSlider = document.getElementById("speed");
const loadingText = document.getElementById("loading-indicator");
const statusText = document.getElementById("status-message");

let array = [];
let isSorting = false;

const getSpeed = () => 300 - parseInt(speedSlider.value);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function updateStatus(msg) {
  statusText.textContent = msg;
}

function generateArray(size = 50) {
  array = [];
  barsContainer.innerHTML = "";
  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 300) + 20;
    array.push(value);
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    bar.style.width = "8px";
    barsContainer.appendChild(bar);
  }
}

function activate(bar, type) {
  bar.classList.add(type);
  bar.style.transform = type === "compare" ? "scaleY(1.2)" : "scaleY(0.85)";
  setTimeout(() => {
    bar.classList.remove(type);
    bar.style.transform = "scaleY(1)";
  }, getSpeed());
}

function swapBars(bar1, bar2) {
  const temp = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = temp;
  activate(bar1, "swap");
  activate(bar2, "swap");
}

async function bubbleSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < bars.length; i++) {
    for (let j = 0; j < bars.length - i - 1; j++) {
      updateStatus("Comparing bars " + j + " and " + (j + 1));
      activate(bars[j], "compare");
      activate(bars[j + 1], "compare");
      await sleep(getSpeed());
      if (parseInt(bars[j].style.height) > parseInt(bars[j + 1].style.height)) {
        updateStatus("Swapping");
        swapBars(bars[j], bars[j + 1]);
        await sleep(getSpeed());
      }
    }
  }
}

async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  const bars = document.querySelectorAll(".bar");
  let left = array.slice(start, mid + 1);
  let right = array.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;

  while (i < left.length && j < right.length) {
    updateStatus("Comparing Merge segments");
    activate(bars[k], "compare");
    await sleep(getSpeed());
    if (left[i] <= right[j]) {
      array[k] = left[i];
      bars[k].style.height = `${left[i]}px`;
      i++;
    } else {
      array[k] = right[j];
      bars[k].style.height = `${right[j]}px`;
      activate(bars[k], "swap");
      j++;
    }
    k++;
    await sleep(getSpeed());
  }

  while (i < left.length) {
    array[k] = left[i];
    bars[k].style.height = `${left[i]}px`;
    i++; k++;
    await sleep(getSpeed());
  }

  while (j < right.length) {
    array[k] = right[j];
    bars[k].style.height = `${right[j]}px`;
    activate(bars[k], "swap");
    j++; k++;
    await sleep(getSpeed());
  }
}

async function quickSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const pivotIdx = await partition(start, end);
  await quickSort(start, pivotIdx - 1);
  await quickSort(pivotIdx + 1, end);
}

async function partition(start, end) {
  const bars = document.querySelectorAll(".bar");
  let pivot = array[end];
  let pivotIndex = start;

  for (let i = start; i < end; i++) {
    updateStatus("Comparing with pivot");
    activate(bars[i], "compare");
    activate(bars[end], "compare");
    await sleep(getSpeed());
    if (array[i] < pivot) {
      [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
      swapBars(bars[i], bars[pivotIndex]);
      await sleep(getSpeed());
      pivotIndex++;
    }
  }
  [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
  swapBars(bars[pivotIndex], bars[end]);
  await sleep(getSpeed());
  return pivotIndex;
}

function celebrateSorted() {
  updateStatus("Sorting Complete 🎉");
  const bars = document.querySelectorAll(".bar");
  bars.forEach((bar, index) => {
    setTimeout(() => {
      bar.style.backgroundColor = "#00ff88";
      bar.style.transform = "scaleY(1.2)";
    }, index * 20);
  });
}

// 🕹️ Dispatcher
async function handleSort() {
  if (isSorting) return;
  isSorting = true;
  loadingText.style.display = "block";
  barsContainer.classList.add("sorting");
  updateStatus("Starting Sort...");

  const algo = algorithmSelect.value;
  if (algo === "bubble") await bubbleSort();
  if (algo === "merge") await mergeSort();
  if (algo === "quick") await quickSort();

  celebrateSorted();
  loadingText.style.display = "none";
  barsContainer.classList.remove("sorting");
  isSorting = false;
}

// 🚀 Events
generateBtn.addEventListener("click", () => generateArray());
sortBtn.addEventListener("click", handleSort);
generateArray();
