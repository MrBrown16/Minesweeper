let rowcol;
let mines;
let flags = 0;
let flaggedmines = 0;
let uncovered = 0;

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
    console.log(begin);
};

function inter(){
    document.getElementById("rowcol").value="16";
    document.getElementById("mines").value="40";
    console.log(inter);

};

function exp(){
    document.getElementById("rowcol").value="22";
    document.getElementById("mines").value="98";
    console.log(exp);
};

function fieldCreate() {
    document.getElementById("setup").style.display = "none";
    uncovered=0;
    flaggedmines=0;
    flags=0;
    let field = document.getElementById("field");
    field.style.marginTop="5%";
    field.innerHTML = "";
    let fieldwidth = field.clientWidth;
    let colwidth = ((fieldwidth/rowcol)+"px");

    for (let i = 0; i < rowcol; i++) {
        let row = document.createElement("div");
        row.className = "row";

        for (let j = 0; j < rowcol; j++) {
            let col = document.createElement("div");
            col.className = "col";
            col.style.width=colwidth;
            col.onmousedown = click;
            row.appendChild(col);
            col.dataset.row = i + 1;
            col.dataset.col = j + 1;
            col.dataset.ch=0;
        };
        field.appendChild(row);
    };
    minePlace();
};

function minePlace() {
    for (let i = 0; i < mines; i++) {
        let x = Math.round(Math.random() * (rowcol - 1));
        let y = Math.round(Math.random() * (rowcol - 1));
        let c = document.getElementById("field").children[x].children[y];
        if (c.dataset.mine == "1") i--;
        else {
            c.dataset.mine = "1";
            c.classList.add("mine");
        }
    }
}

function mineCount(cell){
    let mineNum = 0;


    if ((cell.previousElementSibling)
        && (cell.previousElementSibling.dataset.mine))
        mineNum++;
    //console.log("prev.s",mineNum);

    if ((cell.nextElementSibling)
        && (cell.nextElementSibling.dataset.mine))
        mineNum++;
    //console.log("next.s",mineNum);


    let index = 0;
    let beforeindex = cell.previousElementSibling;

    while (beforeindex) {
        index++;
        beforeindex = beforeindex.previousElementSibling;
        //console.log("elem helye: ",beforeindex);
    }
    if (cell.parentNode.previousElementSibling) {
        let start = (index - 1 >= 0) ? index - 1 : 0;
        let end = (index + 1 < rowcol) ? index + 1 : index;

        for (let i = start; i <= end; i++) {
            if (cell.parentNode.previousElementSibling.children[i].dataset.mine) {
                mineNum++;
            }

        }
    }
    if (cell.parentNode.nextElementSibling) {
        let start = (index - 1 >= 0) ? index - 1 : 0;
        let end = (index + 1 < rowcol) ? index + 1 : index;

        for (let i = start; i <= end; i++) {
            if (cell.parentNode.nextElementSibling.children[i].dataset.mine) {
                mineNum++;
            }

        }
    }
    // cell.innerHTML = mineNum;
    return mineNum;
};

function checkAdjacentDivs(row, col) {
    const adjacentDivs = [];
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col) continue; // skip the chosen div
            const divElem = document.querySelector(`#field [data-row='${r}'][data-col='${c}']`);
        
            if ((divElem)&&(!divElem.dataset.checked)) {
                adjacentDivs.push(divElem);
                
            }
        }
    }
    return adjacentDivs;
}
function click(e) {
    e.preventDefault();
    console.log("e",e);
    console.log("e.target",e.target);
    if (e.button == 2) {
        console.log("right click");
        console.log("this",this);
        //console.log("e",e);
        console.log("flag:",this.classList.contains("flag"));

        if (this.classList.contains("flag")) {
            if (this.classList.contains("mine")) {
                flaggedmines--;
            }
            console.log("flag if:",this.classList.contains("flag"));

            this.classList.remove("flag");
            console.log("flag if2:",this.classList.contains("flag"));
            flags--;
            console.log(flags,flaggedmines);
        }
        else if (!this.classList.contains("flag")) {
            if (this.classList.contains("mine")) {
                flaggedmines++;
            }
            console.log("flag else:",this.classList.contains("flag"));

            this.classList.toggle("flag");
            console.log("flag else2:",this.classList.contains("flag"));

            flags++;
            console.log(flags,flaggedmines);

        }
        
    }
    else {
        if (!this.classList.contains("flag")) {
            
        
            console.log("left click");
            //console.log(e.target.dataset.mine);
            if ((e.target.dataset.mine)&&(!uncovered==0)) {
                console.log("BOOM!!!");
                let cells = document.getElementsByClassName("col");
                for (let i = 0; i < cells.length; i++) {
                    cells[i].onmousedown = null;
                    
                }
                document.getElementById("field").style.marginTop="1%";
                this.classList.remove("mine");
                this.classList.add("bumm");
                document.getElementById("setup").style.display="block";
                document.querySelector("#setup h2").innerHTML = "You died";
                this.style.backgroundColor = "orangered";

            } else if ((!e.target.dataset.mine)&&(this.style.backgroundColor!="green")) {
                console.log("zero mines");
                if (this.style.backgroundColor!="green") {
                    uncovered++;
                }
                this.style.backgroundColor = "green";
                this.innerHTML= mineCount(this);
                if (mineCount(this)===0) {
                    hasNoMinesAround(this);
                }
            } else if ((e.target.dataset.mine)&&(uncovered==0)) {
                
                //let thiscell = e.target;
                fieldCreate();
                // let row = thiscell.dataset.row-1;
                // let col = thiscell.dataset.col-1;
                // let clicked = field.children[row].children[col];
                // console.log("clicked",clicked);
                // click.
                // var Event = EventSource
                // console.log("recreated")
            }
        }
        
    }
    if ((flags==flaggedmines)&&(flaggedmines==mines)&&(((rowcol*rowcol)-mines)<=uncovered)) {
        document.querySelector("#setup h2").innerHTML = "You Won</br>Congratulation!!!";
        document.getElementById("setup").style.display = "block";
        document.getElementById("field").style.marginTop=0;




    }
};

function hasNoMinesAround(cell) {


    if (cell.dataset.ch==="0") {

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const adj = checkAdjacentDivs(row,col);
        cell.dataset.ch=1;
        adj.forEach(cell => {
            console.log("környező db szám",adj.length);
            if (cell.style.backgroundColor!="green") {
                uncovered++;
            }
            cell.style.backgroundColor = "green";

            mc = mineCount(cell);
            cell.innerHTML= mc;
            if (mc===0) {
                // console.log("hasNoMinesAround if");
                // console.log(cell);

                hasNoMinesAround(cell);
            }
        });
    }
    
    
}
