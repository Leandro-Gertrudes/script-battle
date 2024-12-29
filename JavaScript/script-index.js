// index script
function start() {
    const userName = document.querySelector("#user-name").value;
    const selectedClass = document.querySelector('input[name="class"]:checked');



    if (selectedClass && userName) {
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('classSoldier', selectedClass.id);
        window.location.href ="fight.html"
    } else {
        alert("Por favor, escolha um nome e uma classe.");
        return; 
    }
}
function instructions() { //button how to play
    const home = document.querySelector("#contain-index");
    const infos = document.querySelector("#infos");

    if (infos.style.display === "inline-block") {
        home.style.display = "inline-block";
        infos.style.display = "none";
    } else {
        home.style.display = "none";
        infos.style.display = "inline-block";
    }
}

//end index script
