let b;
let rb;
let bb;

let bip;
let rbip;
let bbip;

let d;
let rd;
let bd;

let ipbroad;
let bitsbroad;
let rbroad;
let bbroad;

let ipsub;
let numsub;
let bsub;

let iphost;
let numhost;
let bhost;

let tabla;
let borrar;
window.onload = function(){
    tabla=document.getElementById("tabla");
    borrar=document.getElementById("borrar");
    crearTabla();
    borrar.addEventListener('click', function(){document.getElementById("rsub").remove();crearTabla()})
    b=document.getElementById('b');
    rb=document.getElementById('rb');
    bb=document.getElementById('bb');
    bb.addEventListener('click', function(){rb.innerHTML=binarioADecimal(b.value)})

    bip=document.getElementById('bip');
    rbip=document.getElementById('rbip');
    bbip=document.getElementById('bbip');
    bbip.addEventListener('click', function(){rbip.innerHTML=ipABinario(bip.value)})

    d=document.getElementById('d');
    rd=document.getElementById('rd');
    bd=document.getElementById('bd');
    bd.addEventListener('click', function(){rd.innerHTML=decimalABinario(d.value)})

    ipbroad=document.getElementById('ipbroad');
    bitsbroad=document.getElementById('bitsbroad');
    rbroad=document.getElementById('rbroad');
    bbroad=document.getElementById('bbroad');
    bbroad.addEventListener('click', function(){rbroad.innerHTML=broadcast(ipbroad.value, bitsbroad.value)})

    ipsub=document.getElementById('ipsub');
    numsub=document.getElementById('numsub');
    bsub=document.getElementById('bsub');
    bsub.addEventListener('click', function(){subnetting(ipsub.value, numsub.value)})

    iphost=document.getElementById('iphost');
    numhost=document.getElementById('numhost');
    bhost=document.getElementById('bhost');
    bhost.addEventListener('click', function(){subnettingHost(iphost.value, numhost.value)})

    console.log(disponibilidad(365*24,12+27));
    console.log(disponibilidad(365*24,24+7+5));
    console.log(disponibilidad(365/2*24,24));
    console.log(disponibilidad(365/2*24,7+5));
    console.log(disponibilidad(365*24*60,60));
};

function ipABinario(ip){
    let d = ip.split(".");
    let r = "";
    d.forEach(e => {
        r+=decimalABinario(parseInt(e))+".";
    });
    return r.substring(0,r.length-1);
}

function decimalABinario(n){
    let r = "";
    while(n>1){
        r=n%2+r;
        n=Math.trunc(n/2);
    }
    r=n+r;
    while(r.length<8){
        r=0+r
    }
    return r;
}

function binarioADecimal(n){
    let r = 0;
    for(let i = 0; i<n.length; i++){
        r+=n[n.length-1-i]==1?2**i:0;
    }
    return r;
}

function broadcast(ip, bits){
    bin=ip.split(".");
    let llenos = Math.trunc(bits/8);
    let mascara = [];
    for(let i=0;i<llenos;i++){
        mascara.push('0');
    }

    let espacios = bits%8;
    let r = "";
    for(let i =0;i<espacios;i++){
        r+=0;
    }
    while(r.length<8){
        r=r+1;
    }
    mascara.push(binarioADecimal(r));
    
    while(mascara.length<4){
        mascara.push('255');
    }

    let resultado ="";
    for(let i=0;i<4;i++){
        resultado += mascara[i]|bin[i];
        resultado += ".";
    }
    return resultado.substring(0,resultado.length-1);
}

function subnetting(ip, redes){
    let pow = 0;
    let numero = 0;
    let clase = "";
    let n = 0;
    bin=ip.split(".");
    let byte = 0;
    let num = parseInt(bin[0]);
    if(num>=192){
        numero=24;
        byte=4;
        bin[3]="0";
        clase = "Clase C";
    }else if(num>=128){
        numero=16;
        byte=3;
        bin[2]="0";
        clase = "Clase B";
    }else{
        numero=8;
        byte=2;
        bin[1]="0";
        clase = "Clase A";
    }
    while(redes>n){
        pow++;
        n=2**pow;
    }
    numero+=pow;
    for(let i = 0; i < n; i++){
        let ipRed = ip;
        ip=broadcast(ip, numero);
        let ipBroad=ip;
        let partido = ip.split(".");
        let ipBase = "";
        for(let j = 0; j < 4; j++){
            if(j+1==byte){
                ipBase += (parseInt(partido[j])+1)+".";
            }else if(j+1>byte){
                ipBase += "0"+".";
            }else{
                ipBase += partido[j]+".";
            }
        }
        ip = ipBase.substring(0,ipBase.length-1);
        escribirRedes(ipRed, ipBroad);
    }
    document.getElementById('clase').innerHTML=clase;
}

function subnettingHost(ip, host){
    let pow = 0;
    let n = 0;
    let r = "1";
    while(host>n){
        pow++;
        n+=2**pow;
    }
    let longitud = 8-pow;
    for(let i = 1; i < longitud; i++){
        r+="0";
    }
    subnetting(ip, parseInt(binarioADecimal(r)));
}

function escribirRedes(red, broad){
    let tabla = document.getElementById('rsub');
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    td1.innerHTML=red;
    tr.appendChild(td1);
    let td2 = document.createElement('td');
    td2.innerHTML=broad;
    tr.appendChild(td2);
    tabla.appendChild(tr);
}

function crearTabla(){
    let t = document.createElement("table");
    t.setAttribute('id', "rsub");
    let c = document.createElement("caption");
    c.setAttribute('id', 'clase');
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.innerHTML="Direccion de red";
    let td2 = document.createElement("td");
    td2.innerHTML="Direccion de broadcast";

    tr.appendChild(td1);
    tr.appendChild(td2);
    t.appendChild(c);
    t.appendChild(tr);
    tabla.appendChild(t);
}


function disponibilidad(tEstimado, tInactividad){
    return ((tEstimado - tInactividad)*100)/tEstimado;
}