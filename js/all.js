const url = "https://hexschool.github.io/js-filter-data/data.json";

//點三種不同的種類，蔬菜、水果、花卉可以跑出
const wrap = document.querySelector(".wrap");
const main = document.querySelector(".main");
const button_group = document.querySelector(".button-group");
const showList = document.querySelector(".showList");
const Tr = document.querySelectorAll(".showList > tr")[0];
const Td = document.querySelectorAll(".showList > tr > td")[0];
const text_center = document.querySelector(".text-center");
let array = [];
let filterArray = []; //定義新的陣列，用於存放當下搜尋完的陣列

function getData() {
  axios.get(url).then(function (response) {
    array = response.data;
  });
}

const render = function (array) {
  let str = "";
  array.forEach(function (i) {
    let content = `
    <tr>
      <td>${i.作物名稱}</td>
      <td>${i.市場名稱}</td>
      <td>${i.上價}</td>
      <td>${i.中價}</td>
      <td>${i.下價}</td>
      <td>${i.平均價}</td>
      <td>${i.交易量}</td>
      </tr>
    `;
    str += content;
    showList.innerHTML = str;
  });
};
button_group.addEventListener("click", function (e) {
  if (e.target.nodeName == "BUTTON") {
    let removeActive = document.querySelectorAll(".button-group > button");
    removeActive.forEach((item) => {
      item.classList.remove("active");
    });
    e.target.classList.remove("active");
    showList.innerHTML = `<tr>
         <td colspan="7" class="text-center p-3">資料載入中...</td>
       </tr>`;
    if (e.target.textContent === "蔬菜") {
      filterArray = array.filter(function (i) {
        return i.種類代碼 == "N04";
      });
      let str = "";
      render(filterArray);
      e.target.classList.add("active");
    } else if (e.target.textContent === "水果") {
      filterArray = array.filter(function (i) {
        return i.種類代碼 == "N05";
      });
      let str = "";
      render(filterArray);
      e.target.classList.add("active");
    } else if (e.target.textContent === "花卉") {
      filterArray = array.filter(function (i) {
        return i.種類代碼 == "N06";
      });
      let str = "";
      render(filterArray);
      e.target.classList.add("active");
    }
  }
});

//搜尋並顯示搜尋結果
const searchInput = document.querySelector("#crop");
const searchBtn = document.querySelector(".search");
const show_result = document.querySelector(".show-result");
const crop_input = document.querySelector(".crop-input");

searchBtn.addEventListener("click", function (e) {
  if (searchInput.value.trim() == "") {
    alert("請輸入作物名稱");
  } else {
    show_result.textContent = `查看「${searchInput.value.trim()}」的比價結果`;
    showList.innerHTML = `<tr>
        <td colspan="7" class="text-center p-3">資料載入中...</td>
       </tr>`;
    const newArray = array.filter(function (i) {
      return i.作物名稱;
    });
    filterArray = newArray.filter(function (i) {
      return i.作物名稱.match(searchInput.value);
    });
    render(filterArray);
    searchInput.value = "";
    if (filterArray.length === 0) {
      showList.innerHTML = `<tr>
        <td colspan="7" class="text-center p-3">查詢不到當日的交易資訊QQ</td>
       </tr>`;
    }
  }
});
//按enter也可以搜尋
wrap.addEventListener("keyup", function (e) {
  if (e.code == "Enter") {
    searchBtn.click();
  }
});

//排序篩選的option切換
const sort_select = document.querySelector(".sort-select");
sort_select.addEventListener("click", function (e) {
  if (e.target.value === "排序篩選") {
    return;
  } else if (e.target.value === "依上價排序") {
    filterArray.sort(function (a, b) {
      return a.上價 - b.上價;
    });
  } else if (e.target.value === "依中價排序") {
    filterArray.sort(function (a, b) {
      return a.中價 - b.中價;
    });
  } else if (e.target.value === "依下價排序") {
    filterArray.sort(function (a, b) {
      return a.下價 - b.下價;
    });
  } else if (e.target.value === "依平均價排序") {
    filterArray.sort(function (a, b) {
      return a.平均價 - b.平均價;
    });
  } else if (e.target.value === "依交易量排序") {
    filterArray.sort(function (a, b) {
      return a.交易量 - b.交易量;
    });
  }
  render(filterArray);
});

//點擊表頭中的上下 icon 可以跟著排序
const js_sort_advanced = document.querySelector(".js-sort-advanced");
js_sort_advanced.addEventListener("click", function (e) {
  if (e.target.nodeName == "I") {
    //如果是點到I裡面的<i data-price="上價" data-sort="up" class="fas fa-caret-up"></i>
    let clickSortIcon = e.target.dataset.sort; //可以知道點到的是down 或是up的箭頭圖示
    let clickSortName = e.target.dataset.price; //可以知道點到的是哪個名稱
    if (clickSortIcon == "up") {
      filterArray.sort(function (a, b) {
        return b[clickSortName] - a[clickSortName]; //不能用b.clickSortName來取，因為將其定義為變數，只能用bracket notation取
      });
    } else {
      filterArray.sort(function (a, b) {
        return a[clickSortName] - b[clickSortName];
      });
    }
    render(filterArray);
  }
});

getData();