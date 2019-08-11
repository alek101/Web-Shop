let ws={
    //Metode za pravljenje HTML strana
    napPrS:function(korpa,proizvod){
        //napravi malu karticu sa proizvodom
        let id=proizvod.id;
        let pr1=pf.makeElement("div",{text:null,className:strana.klasItem});
        let naziv=pf.makeElement("p",{text:proizvod.naziv,className:strana.klasNam});
        let slika=pf.makeElement('img',{src:proizvod.picture.small,className:strana.klasSmPc,width:120,height:120});
        let pr2=pf.makeElement('p');
            let cenaText=`Cena: ${pf.formatBroja(proizvod.cena)} дин`;
            let cena=pf.makeElement('spam',{text:cenaText,className:strana.klasSp1});
            pr2.append(cena);
            if(proizvod.cena2>0 && proizvod.cena2!=undefined){
                let cenaText2=`Cena: ${pf.formatBroja(proizvod.cena2)} дин`;
                let cena2=pf.makeElement('spam',{text:cenaText2,className:strana.klasSp2});
                pr2.append(cena2);
            }
        let link=pf.makeElement('a',{href:`${strana.adresa}?id=${encodeURIComponent(id)}`,text:"Детаљније",className:strana.klasLink});
        let dugKorpa=pf.makeElement('button',{text:"додај",className:strana.klasDug2});
            let that=this;
            dugKorpa.addEventListener('click',function(){
                that.dodajUkorpu(korpa,proizvod);
                that.upisVrKorpeDugme(korpa);
            })
        pr1.append(naziv,slika,pr2,link,dugKorpa);
        return pr1;
    },
    napSvePr:function(korpa,proizvodi,roditelj){
        //napravi sve proizvode sa malom karticom
        roditelj.innerHTML="";
        for(let proizvod of proizvodi){
            roditelj.append(this.napPrS(korpa,proizvod));
        }
    },
    napPrL:function(korpa,proizvod){
        let pr1=pf.makeElement("div",{text:null,className:strana.klasProdL});
        let naziv=pf.makeElement("p",{text:proizvod.naziv,className:strana.klasNamL});
        let slika=pf.makeElement('img',{src:proizvod.picture.small,className:strana.klasLgPc,width:600,height:600});
        let pr2=pf.makeElement('p');
            let cenaText=`Cena: ${pf.formatBroja(proizvod.cena)} дин`;
            let cena=pf.makeElement('spam',{text:cenaText,className:strana.klasSp1});
            pr2.append(cena);
            if(proizvod.cena2>0 && proizvod.cena2!=undefined){
                let cenaText2=`Cena: ${pf.formatBroja(proizvod.cena2)} дин`;
                let cena2=pf.makeElement('spam',{text:cenaText2,className:strana.klasSp2});
                pr2.append(cena2);
            }
            pr1.append(naziv,slika,pr2);    
        for (let opis in proizvod.dodatno){
                    let o=opis.split("_").join(" ");
                    pr1.append(pf.makeElement('p',{text:`${o}: ${proizvod.dodatno[opis]}`,className:strana.klasDes2},));
                }
        let dugKorpa=pf.makeElement('button',{text:"додај",className:strana.klasDug});
            let that=this;
            dugKorpa.addEventListener('click',function(){
                that.dodajUkorpu(korpa,proizvod);
                that.upisVrKorpeDugme(korpa);
            })
        pr1.append(dugKorpa);
        return pr1;
    },
    napPrStranu:function(korpa,proizvodi,id,roditelj){
        //napravi veliku stranu u zavisnosti od ID-a
        let i=pf.nadjiProizvodPoId(id,proizvodi);
        roditelj.append(this.napPrL(korpa,proizvodi[i]));
    },
    dodajRed:function(korpa,proizvodKorpa,proizvodi,klS="",klDu=""){
        let that=this;
        let ind=pf.nadjiProizvodPoId(proizvodKorpa.id,proizvodi);
        let f=document.createDocumentFragment();
        let tr=document.createElement('tr');

        let t1=pf.makeElement("td",{text:proizvodKorpa.naziv});
        let t2=document.createElement('td');
            t2.append(pf.makeElement('img',{src:proizvodi[ind].picture.small,className:klS,width:120,height:120}));
        let t4=pf.makeElement("td",{text:pf.formatBroja(proizvodKorpa.cena)});
        let tKol=pf.makeElement("td",{text:proizvodKorpa.kolicina});
        let tVr=pf.makeElement("td",{text:pf.formatBroja(proizvodKorpa.vrednost)});
        
        let t3=document.createElement('td');
          function pomFun(){
            //menja kolicinu i vrednost na ekranu, i brise red ako je kolicina <=0
            tKol.innerHTML=proizvodKorpa.kolicina;
            tVr.innerHTML=pf.formatBroja(proizvodKorpa.vrednost);
            if(tKol.innerHTML<=0) tr.remove();
          }

        let smanji=pf.makeElement('button',{text:"-",className:klDu});
            smanji.addEventListener('click',function(){
                that.dodajUkorpu(korpa,proizvodi[ind],-1);
                pomFun();
                console.log(korpa);
            })

        let povecaj=pf.makeElement('button',{text:"+",className:klDu});
            povecaj.addEventListener('click',function(){
                that.dodajUkorpu(korpa,proizvodi[ind],1);
                pomFun();
                console.log(korpa);
            })

        let X=pf.makeElement('button',{text:"X",className:klDu});
            X.addEventListener('click',function(){
                that.dodajUkorpu(korpa,proizvodi[ind],-proizvodKorpa.kolicina);
                pomFun();
                console.log(korpa);
            })
        t3.append(smanji,povecaj,X);
        f.append(t1,t2,t4,tKol,tVr,t3);
        tr.append(f);
        return tr;
    },
    napraviTabelu:function(korpa,proizvodi,roditelj,klS,klDu){
        for (let proizvodKorpa of korpa){
            roditelj.append(this.dodajRed(korpa,proizvodKorpa,proizvodi,klS,klDu));
        }
    },
    //Ostale metode
    dodajUkorpu:function(korpa,proizvod,k=1){
        pf.addBasket(korpa,proizvod,k);
        sessionStorage.setItem('korpa',JSON.stringify(korpa));
        console.log(korpa);
    },
    findName:function(korpa,proizvodi,input,roditelj){
        console.log(proizvodi);
        //filter po imenu
        let n=proizvodi.filter(c=>c.naziv.toLowerCase().includes(input.toLowerCase())).sort((a,b)=>(a.naziv>b.naziv)? 1:-1);
        this.napSvePr(korpa,n,roditelj);
    },
    filterCost:function(korpa,proizvodi,roditelj,p=1,min=0,max=Infinity,){
        //filter po ceni,p=1 za rastucu cenu, p=-1 za opadajucu cenu
        let n=proizvodi.filter(c=>c.cena>=min && c.cena<=max).sort((a,b)=>(a.cena>b.cena)? p:-p);
        this.napSvePr(korpa,n,roditelj);
    },
    ukupnaVrednost:function(korpa){
        return korpa.reduce((s,c)=>s+c.vrednost,0);
    },
    upisiVrednostKorpe:function(korpa,roditelj){
        let vr=this.ukupnaVrednost(korpa);
        vr=pf.formatBroja(vr);
        roditelj.append(`Укупна вредност ваше корпе је: ${vr} дин!`);
    },
    naruci:function(){
        sessionStorage.clear();
    },
    upisVrKorpeDugme:function(korpa){
        let vr=this.ukupnaVrednost(korpa);
        let vrUpis=pf.formatBroja(vr);
        console.log("vrednost korpe",vr,vrUpis);
        (vr>0)? strana.dugKorpa.innerHTML=vrUpis+" дин":"КОРПА";
    },
}

let strana={
    filter: document.querySelector('.filter'),
    prod: document.querySelector('.products'),
    klasItem: "item",
    klasNam: "namePr",
    klasSmPc: "smallPicure",
    klasDes1: "smallDes",
    klasProdL: "itemL",
    klasNamL: "nameL",
    klasLgPc: "largePicture",
    klasDes2: "bigDes",
    klasDes22: "bigDes bigDes-precrtano",
    klasDes23: "bigDes bigDes-usteda",
    klasDug: "dugme",
    klasDug2: "dugme dugme1",
    adresa: "detaljnije.html",
    klasLink: "linkDetaljnije",
    prodDet: document.querySelector('.proizvodDetaljnije'),
    inputi: document.querySelectorAll('input'),
    tabela: document.querySelector('table'),
    klasTD: "celija",
    rezKor:document.querySelector('.rezKorpe'),
    naruci: document.querySelector('#naruci'),
    malDug: "maloDugme",
    klasSp1: "cena",
    klasSp2: "cena cena-precrtana",
    krit: document.querySelector('#kriterijum'),
    dugKorpa: document.querySelector('#dugmeKorpa'),
    pocStranica: document.querySelector('#pocetna'),
 }


