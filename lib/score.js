 //fungsi ambil nama user
 window.onload = function () {
     var namaUser = prompt("What's your name?");
     string = document.createElement("string");
     string = " Let's kill some virus " + namaUser;
     document.getElementById("output").innerHTML = string;
 };

 function addScore() {
     if (jumlahCorona = 0) {
         stringWin = " Corona eradicated ";
         document.getElementById("output").innerHTML = stringWin;
     } else if (jumlahCorona = 1) {
         stringOne = " One more virus to kill ";
         document.getElementById("output").innerHTML = stringOne;
     } else if (jumlahCorona = 2) {
         stringTwo = " Couple more virus to kill ";
         document.getElementById("output").innerHTML = stringTwo;
     } else if (jumlahCorona = 3) {
         stringThree = " Three more virus to kill ";
         document.getElementById("output").innerHTML = stringThree;
     }


 }