let rowcol;
let mines;
// const cells = {id, value};
const cellsArray = [];
//id === index;
//{id : null, value : null}
//value-types: [1 = not_mine, 2 = mine, 3 = flagged_mine, 4 = flagged_not_mine, 5 = exposed ]

let flags = 0;
let flaggedmines = 0;
let uncovered = 0;
let tapTimer;


window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

document.getElementById("input").onsubmit = function (e) {
    e.preventDefault();
    
    rowcol = Number(e.target.elements.rowcol.value);
    mines = Number(e.target.elements.mines.value);

    if (mines >= (rowcol * rowcol)) {
        document.querySelector("#setup h2").innerHTML = "Are you mentally challenged?";
        document.getElementById("mines").style.backgroundColor = "red";
        return false;
    }
    fieldCreate();
};

function begin(){
    document.getElementById("rowcol").value="9";
    document.getElementById("mines").value="10";
};

function inter(){
    document.getElementById("rowcol").value="16";
    document.getElementById("mines").value="40";
};

function exp(){
    document.getElementById("rowcol").value="22";
    document.getElementById("mines").value="98";
};

function fieldCreate() {
    document.getElementById("setup").style.display = "none";
    // uncovered=0;
    // flaggedmines=0;
    // flags=0;
    let field = document.getElementById("field");
    field.style.marginTop="5%";
    field.innerHTML = "";
    let fieldwidth = field.clientWidth;
    let colwidth = ((fieldwidth/rowcol)+"px");
    let ezid = 0;
    for (let i = 0; i < rowcol; i++) {
        let row = document.createElement("div");
        row.className = "row";

        for (let j = 0; j < rowcol; j++) {
            let col = document.createElement("div");
            col.className = "col";
            col.id = ezid;
            ezid++;
            col.style.width=colwidth;
            col.onmousedown = click;
            
            // cells = ;
            cellsArray.push({value : 1 });
            row.appendChild(col);
        };
        field.appendChild(row);
    };
    console.log("cellsArray: ", cellsArray);
    console.log("typeof(cellsArray[1].value): ", typeof(cellsArray[1].value));
    minePlace();
    // console.log("cellsArray: ", cellsArray);

};

function minePlace() {
    for (let i = 0; i < mines; i++) {
        let x = (Math.round(Math.random() * ((rowcol * rowcol) - 1)));
        console.log("x: ", x);
        let c = cellsArray[x];
        console.log("cellsArray[x]: ", cellsArray[x]);

        if ( c.value == 2 ) i--;
        else {
            c.value = 2;
            // c.classList.add("mine");
        }
    }
}

function mineCount(id){ //needs the id of the div
    let mineNum = 0;
    console.log("id: ", id);
    console.log(cellsArray);
    const adjacent = checkAdjacentDivs(id);
    console.log("adjacent: ", adjacent);
    adjacent.forEach(e => {
        console.log("typeof(cellsArray[1].value): ", typeof(cellsArray[1].value));
        console.log("forEach e: ",e,"id: ", id);
        if (cellsArray[e].value == 2) {
            console.log("if value 2 e: ",e,"id: ", id);
            mineNum++;
        }else if (cellsArray[e].value == 3) {
            mineNum++;
            console.log("elif value 3 e: ",e,"id: ", id);
        }
    });
    console.log("minenum: ", mineNum);
    return mineNum;
};

// function checkAdjacentDivs(id) {
//     const adjacentDivs = [];
//     const localid = Number(id);
//     const col = localid % rowcol;
//     const row = Math.floor(localid / rowcol);

//     // Top-left corner
//     if (row === 0 && col === 0) {
//         adjacentDivs.push(localid + 1, localid + rowcol, localid + rowcol + 1);
//     }
//     // Top-right corner
//     else if (row === 0 && col === rowcol - 1) {
//         adjacentDivs.push(localid - 1, localid + rowcol, localid + rowcol - 1);
//     }
//     // Bottom-left corner
//     else if (row === rowcol - 1 && col === 0) {
//         adjacentDivs.push(localid - rowcol, localid - rowcol + 1, localid + 1);
//     }
//     // Bottom-right corner
//     else if (row === rowcol - 1 && col === rowcol - 1) {
//         adjacentDivs.push(localid - rowcol - 1, localid - rowcol, localid - 1);
//     }
//     // Top edge
//     else if (row === 0) {
//         adjacentDivs.push(localid - 1, localid + 1, localid + rowcol - 1, localid + rowcol, localid + rowcol + 1);
//     }
//     // Bottom edge
//     else if (row === rowcol - 1) {
//         adjacentDivs.push(localid - rowcol - 1, localid - rowcol, localid - rowcol + 1, localid - 1, localid + 1);
//     }
//     // Left edge
//     else if (col === 0) {
//         adjacentDivs.push(localid - rowcol, localid - rowcol + 1, localid + 1, localid + rowcol, localid + rowcol + 1);
//     }
//     // Right edge
//     else if (col === rowcol - 1) {
//         adjacentDivs.push(localid - rowcol - 1, localid - rowcol, localid - 1, localid + rowcol - 1, localid + rowcol);
//     }
//     // Inner cells
//     else {
//         adjacentDivs.push(
//             localid - rowcol - 1, localid - rowcol, localid - rowcol + 1,
//             localid - 1, localid + 1,
//             localid + rowcol - 1, localid + rowcol, localid + rowcol + 1
//         );
//     }
//     console.log("check end adjacentdivs: ", adjacentDivs);
//     //return adjacentDivs.filter(adjacentId => adjacentId >= 0 && adjacentId < rowcol * rowcol).map(adjacentId => Number(adjacentId));
//     return adjacentDivs.filter(adjacentId => {
//         const row = Math.floor(adjacentId / rowcol);
//         const col = adjacentId % rowcol;
//         return adjacentId >= 0 && adjacentId < rowcol * rowcol && row >= 0 && row < rowcol && col >= 0 && col < rowcol;
//       });
      
// }
  
  
  


// function checkAdjacentDivs(id) { //needs the id of the div
//     const adjacentDivs = [];
//     let localcellid = id;
//     let localcell = id+1;
//     let col = localcell % rowcol;
//     if ((col == 1)&&(localcell <= rowcol)) {  //első cella, első sor
//         adjacentDivs.push((localcellid+1), (localcellid+22), (localcellid+23));
//         console.log(" check 1/1 adjacentdivs: ", adjacentDivs);
//     } else if ((col == 0)&&(localcell <= rowcol)) { //utolsó cella, első sor
//         adjacentDivs.push((localcellid-1), (localcellid+21), (localcellid+22));
//         console.log(" check 1/2 adjacentdivs: ", adjacentDivs);
//     }else if ((col == 1)&&(localcell > (rowcol * (rowcol - 1)))) {  //első cella, utolsó sor
//         adjacentDivs.push((localcellid-22), (localcellid-21), (localcellid+1))
//         console.log(" check 1/3 adjacentdivs: ", adjacentDivs);
//     }else if ((col == 0)&&(localcell > (rowcol * (rowcol - 1)))) { //utolsó cella, utolsó sor
//         adjacentDivs.push((localcellid-23), (localcellid-22), (localcellid-1))
//         console.log(" check 1/4 adjacentdivs: ", adjacentDivs);
//     }else if (col == 1) {  //első cella
//         adjacentDivs.push((localcellid-22), (localcellid-21), (localcellid+1), (localcellid+22), (localcellid+23));
//         console.log(" check 1/5 adjacentdivs: ", adjacentDivs);
//     }else if (col == 0) { //utolsó cella
//         adjacentDivs.push((localcellid-23), (localcellid-22), (localcellid-1), (localcellid+21), (localcellid+22));
//         console.log(" check 1/6 adjacentdivs: ", adjacentDivs);
//     }else{ // belső cellák (minden irányban van pontosan egy cella kijjebb). (remélhetőleg nem lesz olyan cella ami kívül esik a korábbi feltételeken, és nem belső cella)
//         adjacentDivs.push((localcellid-23), (localcellid-22), (localcellid-21), (localcellid-1), (localcellid+1), (localcellid+21), (localcellid+22), (localcellid+23));
//         console.log(" check 1/7 adjacentdivs: ", adjacentDivs);
//     }
//     console.log("check end adjacentdivs: ", adjacentDivs);
//     return adjacentDivs;
// }

function click(e) {
    // if(/Mobi/.test(navigator.userAgent)) {console.log("mobil");}
    // else {console.log("desktop");}
    e.preventDefault();
    let ez = e.target;
    let id = e.target.id;
    let value = cellsArray[id].value;
    let len = cellsArray.length;
    console.log("clicked ", e, "id: ",id);
    console.log("cellsArray.length ", len);

    clearTimeout(tapTimer);
    if (e.button == 2) { //right-click
        console.log("right-clicked ", e, "id: ",id);

        if (cellsArray[id].value == 3) { // type 3
            //type 3 flagged_mine  -->> type 2 mine
            ez.classList.remove("flag");
            cellsArray[id].value = 2;
            flaggedmines--;
        }
        else if (cellsArray[id].value == 2) { //type 2 mine  -->> type 3 flagged_mine
            
            ez.classList.toggle("flag");
            cellsArray[id].value = 3;
            flaggedmines++;
        }
        else if (cellsArray[id].value == 4) { // type 4
            //type 4 flagged_not_mine  -->> type 1 not_mine
            
            ez.classList.remove("flag"); // cellsArray[id].value == 1;
            cellsArray[id].value = 1;
            flags--;
        }
        else if (cellsArray[id].value == 1) { //type 1 not_mine  -->> type 4 flagged_not_mine

            ez.classList.toggle("flag");
            cellsArray[id].value = 4;
            flags++;
        }

    }
    else { //left click
        console.log("left-clicked ", e, "id: ",id);
        if ((cellsArray[id].value != 3) && (cellsArray[id].value != 4)) { //not flagged clickable
            console.log("not flagged left-clicked ", e, "id: ",id);
            if ((cellsArray[id].value == 2) && (!uncovered == 0)) { //type 2 mine -->> bumm  element.classList.add("bumm"); (mines become visible, should 
                                                                    //differentiate between flagged and not flagged)
                console.log("clicked bumm", e, "id: ",id);
                // let cells = document.getElementsByClassName("col");
                document.getElementById("field").style.marginTop = "1%";
                // ez.classList.remove("mine");
                ez.classList.add("bumm");
                document.getElementById("setup").style.display = "block";
                document.querySelector("#setup h2").innerHTML = "You died";
                ez.style.backgroundColor = "orangered";

            } else if ((cellsArray[id].value != 2) && (ez.style.backgroundColor != "green")) { //type 1 not_mine -->> type 5 exposed
                console.log("clicked not mine", e, "id: ",id);

                if (ez.style.backgroundColor != "green") {
                    uncovered++;
                }
                ez.style.backgroundColor = "green";
                let minecount = mineCount(id); // let minecount = mineCount(id);
                console.log(minecount)
                ez.innerHTML = minecount; //ez.innerHTML = mineount;
                if (minecount == 0) { //minecount == 0 (no mines around)
                    console.log("minecount == 0", mineCount(id), id);
                    hasNoMinesAround(id); // hasNoMinesAround(id)
                }
                // let allcol = document.getElementsByClassName("col");
                // allcol.forEach(e => {
                //     e.dataset.ch = 0;
                // });
            } else if ((cellsArray[id].value == 2) && (uncovered == 0)) { // first click and type 2 recreate field so you dont loose instantly (should open the clicked cell)
                fieldCreate();
                console.log("clicked first mine recreated", e, "id: ",id);

            }
            else{
                console.log("left-clicked no results", e, "id: ",id);
            }
            //else if type 3 or 4 not clickable
        }

    }
    // if ((flags==flaggedmines)&&(flaggedmines==mines)&&(((rowcol*rowcol)-mines)<=uncovered)) {
    //     document.querySelector("#setup h2").innerHTML = "You Won</br>Congratulation!!!";
    //     document.getElementById("setup").style.display = "block";
    //     document.getElementById("field").style.marginTop=0;
    // }
};

function hasNoMinesAround(id) { //called only when mineCount(id) == 0;


    if (cellsArray[id].value == 1) { //type 1 not_mine

        const adj = checkAdjacentDivs(id);
        document.getElementById(id).dataset.ch=1;
        adj.forEach(id => {
            if ((document.getElementById(id).dataset.ch == 0)&&(cellsArray[id].value != 5)) { //not checked and not exposed (type != 5)
                uncovered++;
            }
            document.getElementById(id).style.backgroundColor = "green"; //
            cellsArray[id].value = 1;
            mc = mineCount(id);
            cellsArray[id].innerHTML= mc;
            if (mc===0) { //found another adjacent cell with no mines around
                hasNoMinesAround(id);
            }
            
        });
        
    }
};


document.addEventListener("touchstart", function(e){
    // Start a timeout to simulate a right-click after 500ms
    this.longPressTimeout = setTimeout(function() {
        simulateRightClick(e);
    }, 500);
});

document.addEventListener("touchend", function(e){
    // Clear the timeout to prevent the right-click from firing
    clearTimeout(this.longPressTimeout);
});

document.addEventListener("touchmove", function(e){
    // If the user moves their finger before the timer fires, cancel the timer
    clearTimeout(tapTimer);
});

// Simulate a right-click event
function simulateRightClick(e){
    // Prevent the default context menu from appearing
    if (e.cancelable) {
        e.preventDefault();
      }
    // Create a new mouse event with the right-click button pressed
    var rightClickEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 2,
        // Set the coordinates of the mouse event to the touch location
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
    });
    // Dispatch the mouse event on the target element
    e.target.dispatchEvent(rightClickEvent);
    click(rightClickEvent);
}