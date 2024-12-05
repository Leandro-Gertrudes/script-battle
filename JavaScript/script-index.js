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

//end index script