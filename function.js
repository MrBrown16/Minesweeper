let rowcol;
let mines;

window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

document.getElementById("input").onsubmit=function(e){
    e.preventDefault();
    
    rowcol = Number(e.target.elements.rowcol.value);
    
    mines = Number(e.target.elements.mines.value);

    if (mines>=(rowcol*rowcol)){
        document.querySelector("#setup h2").innerHTML="Are you mentally challenged?";
        document.getElementById("mines").style.backgroundColor="red";
        return false;
    }
    fieldCreate();    
    minePlace();
    //mineCount(element);
    

  
};
function fieldCreate(){
    document.getElementById("setup").style.display = "none";

    let field = document.getElementById("field");

    field.innerHTML = "";
    for (let i = 0; i < rowcol; i++) {
        let row = document.createElement("div");
        row.className = "row";
        
        for (let j = 0; j < rowcol; j++) {
            let col = document.createElement("div");
            col.className = "col";   
            col.onmousedown = click;
            row.appendChild(col);
            col.dataset.rowi=i+1;
            col.dataset.coli=j+1;
        };
        field.appendChild(row);
    };
    let cells = document.getElementsByClassName("col");

    for (let i = 0; i < cells.length; i++) {
        let mc = mineCount(cells[i]);
        cells[i].dataset.mineCount = mc;        
        cells[i].innerHTML = (mc==0?"":mc);
    }
};
 
function minePlace(){
    for (let i = 0; i < mines; i++) {
        let x = Math.round(Math.random()*(rowcol-1));
        let y = Math.round(Math.random()*(rowcol-1));
        let c = document.getElementById("field").children[x].children[y];
        if (c.dataset.mine == "1") i--;
        else{
            c.dataset.mine = "1";
            c.classList.add("mine");
        }
    }
}
function mineCount(cell){
    let mineNum = 0;

    if (!cell.dataset.mine){
        if((cell.previousElementSibling)
            && (cell.previousElementSibling.dataset.mine))
                mineNum++;
                //console.log("prev.s",mineNum);

        if((cell.nextElementSibling)
            && (cell.nextElementSibling.dataset.mine))
                mineNum++;
                //console.log("next.s",mineNum);


        let index = 0;
        let beforeindex = cell.previousElementSibling;

        while(beforeindex){
            index++;
            beforeindex = beforeindex.previousElementSibling;
            //console.log("elem helye: ",beforeindex);
        }
        if(cell.parentNode.previousElementSibling){
            let start = (index - 1 >= 0)?index - 1 : 0;
            let end = (index + 1 < rowcol)?index + 1 : index;

            for (let i = start; i <= end; i++) {
                if (cell.parentNode.previousElementSibling.children[i].dataset.mine) {
                    mineNum++;
                }
                
            }
        }
        if(cell.parentNode.nextElementSibling){
            let start = (index - 1 >= 0)?index - 1 : 0;
            let end = (index + 1 < rowcol)?index + 1 : index;

            for (let i = start; i <= end; i++) {
                if (cell.parentNode.nextElementSibling.children[i].dataset.mine) {
                    mineNum++;
                }
                
            }
        }
        cell.innerHTML = mineNum;
    }
    return mineNum;
};
// function surroundingcells(cell){
//     let cellrow = cell.dataset.rowi;
//     let cellcol = cell.dataset.coli;
//     if ((cellrow != 1) && (cellrow != rowcol)){
//         if((cellcol != 1) && (cellcol != rowcol)){
//             for (let i = cellrow-1; i < cellrow+1; i++) {
//                 for (let i = cellcol-1; i < cellcol+1; i++) {
//                     cell.dataset.c
                    
//                 }
                
//             }
//         }
//     }
      

// }
function checkAdjacentDivs(row, col) {
    const adjacentDivs = [];
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col) continue; // skip the chosen div
            const divElem = document.querySelector(`#field [data-row='${r}'][data-col='${c}']`);
            if (divElem) {
                adjacentDivs.push(divElem);
            }
        }
    }
    console.log(adjacentDivs)
    adjacentDivs.forEach(div => mineCount(div));
}
  
function click(e){
    // console.log("e",e);
    // console.log("e.which",e.which);
    //console.log("this=",this);
    // console.log("this.prev.sib=",this.previousElementSibling);
    // console.log("this.parentN.prev.sib=",this.parentNode.previousElementSibling);

    if (e.which>1) this.classList.toggle("flag");
    if (e.which == 1) {
        //console.log("1");
        if (this.dataset.mine) {
            let cells = document.getElementsByClassName("col");
            for (let i = 0; i < cells.length; i++) {
                cells[i].onmousedown = null;
                
            }
        
            this.classList.remove("mine");
            this.classList.add("bumm");
            document.getElementById("setup").style.display="block";
            document.querySelector("#setup h2").innerHTML = "You died";
            this.style.backgroundColor = "orangered";
        }
        else{
            this.style.backgroundColor = "green";
            mineCount(this);
            let chosenRow = this.dataset.rowi;
            let chosenCol = this.dataset.coli;
            const chosenDiv = document.querySelector(`#field [data-row='${chosenRow}'][data-col='${chosenCol}']`);
            checkAdjacentDivs(chosenRow, chosenCol);

        }
    }

};