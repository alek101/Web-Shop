let ws={
    //napravi HTML element
    napEl:function(tip="div",text="",klas=""){
        let el=document.createElement(tip);
        el.innerHTML=text;
        el.className=klas;
        return el;
    },
    napSl:function(addr,alte="There is no picture",klas="",w=0,h=0){
        //napravi HTML sliku
        let s=document.createElement('img');
        s.src=addr;
        s.alt=alte;
        s.className=klas;
        if(w>0) s.style.width=w+"px";
        if(h>0) s.style.height=h+"px";
        return s;
    },
    napLink:function(add,id,text="",klas=""){
        //napravi anchor sa href ka strani detaljnije
        let a=document.createElement('a');
        a.href=`${add}?id=${encodeURIComponent(id)}`;
        a.innerHTML=text;
        a.className=klas;
        return a;
    },
    napTD:function(text="",klas=""){
        let td=document.createElement('td');
        td.innerHTML=text;
        td.className=klas;
        return td;
    },
    napPrS:function(proizvod){
        //napravi malu karticu sa proizvodom
        let id=proizvod.id;
        let pr1=this.napEl('div',null,strana.klasProd);
        pr1.append(this.napEl('p',proizvod.name,strana.klasNam));
        pr1.append(this.napSl(proizvod.picture.small,"Нема слике",strana.klasSmPc,120,120));
        let pr2=this.napEl('div',null,strana.klasDes1);
        for (let opis in proizvod.short){
            if(opis=="cost"){
                let c=this.formatBroja(proizvod.short[opis]);
                pr2.append(this.napEl('p',`цена: ${c} дин`,strana.klasSp1));
            }
            else if(opis=="cost2" && proizvod.short[opis]>0){
                let c=this.formatBroja(proizvod.short[opis]);
                pr2.append(this.napEl('p',`${c} дин`,strana.klasSp2));
            }
            else if(opis=="cost2" && proizvod.short[opis]<=0){
                //ne radi nista
            }
            else{
                pr2.append(this.napEl('p',`${opis}: ${proizvod.short[opis]}`,strana.klasDes1));
            }
        }
        pr1.append(pr2);
       pr1.append(this.napLink(strana.adresa,id,"Детаљније",strana.klasLink));
        let dugKorpa=this.napEl('button',"додај",strana.klasDug2);
        let that=this;
        dugKorpa.addEventListener('click',function(){
            that.dodajUkorpu(proizvod);
            that.upisVrKorpeDugme(korpa);
        })
        pr1.append(dugKorpa);
        return pr1;
    },
    dodajUkorpu:function(proizvod,k=1){
        //dodavanje u korpu
        let id=proizvod.id;
        let b=(korpa.length>0) && korpa.some(c=>c.id==id);
            if(!b){
                let c=proizvod.short.cost;
                let cl={
                    id:id,
                    cena: c,
                    kolicina: k,
                    vrednost: c,
                }
                korpa.push(cl);
            }
            else{
                let i=korpa.findIndex(c=>c.id==id);
                korpa[i].kolicina+=k;
                korpa[i].vrednost+=korpa[i].cena*k;
                //procedura za brisanje
                if (korpa[i].kolicina<=0) korpa.splice(i,1);
            }
            sessionStorage.setItem('korpa',JSON.stringify(korpa));
            console.log(korpa);
    },
    napSvePr:function(proizvodi,roditelj){
        //napravi sve proizvode sa malom karticom
        roditelj.innerHTML="";
        for(let proizvod of proizvodi){
            roditelj.append(this.napPrS(proizvod));
        }
    },
    napPrL:function(proizvod){
        //napravi veliku kartu
        let pr1=this.napEl('div',null,strana.klasProdL);
        pr1.append(this.napEl('p',proizvod.name,strana.klasNamL));
        pr1.append(this.napSl(proizvod.picture.large,"Нема слике",strana.klasLgPc,600,600));
        for (let opis in proizvod.short){
            if(opis=="cost"){
                let c=this.formatBroja(proizvod.short[opis]);
                pr1.append(this.napEl('p',`Цена: ${c} дин`,strana.klasDes2));
            }
            else if(opis=="cost2" && proizvod.short[opis]>0){
                let c=this.formatBroja(proizvod.short[opis]);
                let u=this.formatBroja(proizvod.short[opis]-proizvod.short["cost"]);
                pr1.append(this.napEl('p',`Уштеда: ${u} дин`,strana.klasDes23));
                pr1.append(this.napEl('p',`Стара цена: ${c} дин`,strana.klasDes22));
            }
            else if(opis=="cost2" && proizvod.short[opis]<=0){
                //ne radi nista
            }
            else{
                pr1.append(this.napEl('p',`${opis}: ${proizvod.short[opis]}`,strana.klasDes2));
            }
        }
        for (let opis in proizvod.additional){
            pr1.append(this.napEl('p',`${opis}: ${proizvod.additional[opis]}`,strana.klasDes2));
        }
        let dugKorpa=this.napEl('button',"додај",strana.klasDug);
        let that=this;
        dugKorpa.addEventListener('click',function(){
            that.dodajUkorpu(proizvod);
            that.upisVrKorpeDugme(korpa);
        })
        pr1.append(dugKorpa);

        return pr1;
    },
    nadjiIDstrane:function(){
        //nadji id strane
        return window.location.href.split('?').map(c=>c.split('=')).flat(1).map(c=>c.split('&')).flat(1)[2];
    },
    nadjiIDstrane2:function(){
        //nadji id strane
        return window.location.href.split('?').flatMap(c=>c.split('=')).flatMap(c=>c.split('&'))[2];
    },
    nadjiPr:function(id,proizvodi){
        //nadji indeks proizvoda
        return proizvodi.findIndex(c=>c.id==id);
    },
    napPrStranu:function(proizvodi,id,roditelj){
        //napravi veliku stranu u zavisnosti od ID-a
        let i=this.nadjiPr(id,proizvodi);
        roditelj.append(this.napPrL(proizvodi[i]));
    },
    findName:function(proizvodi,input,roditelj){
        //filter po imenu
        let n=proizvodi.filter(c=>c.name.toLowerCase().includes(input.toLowerCase())).sort((a,b)=>(a.name>b.name)? 1:-1);
        this.napSvePr(n,roditelj);
    },
    filterCost:function(proizvodi,roditelj,p=1,min=0,max=Infinity,){
        //filter po ceni,p=1 za rastucu cenu, p=-1 za opadajucu cenu
        let n=proizvodi.filter(c=>c.short.cost>=min && c.short.cost<=max).sort((a,b)=>(a.short.cost>b.short.cost)? p:-p);
        this.napSvePr(n,roditelj);
    },
    dodajRed:function(proizvodKorpa,proizvodi,klS="",klDu=""){
        let that=this;
        let ind=this.nadjiPr(proizvodKorpa.id,proizvodi);
        let f=document.createDocumentFragment();
        let tr=document.createElement('tr');

        let t1=this.napTD(proizvodi[ind].name);
        f.append(t1);
        let t2=document.createElement('td');
        t2.append(this.napSl(proizvodi[ind].picture.small,"Nema slike",klS,120,120));
        f.append(t2);
        let t4=this.napTD(this.formatBroja(proizvodKorpa.cena));
        f.append(t4);
        let tKol=this.napTD(proizvodKorpa.kolicina);
        f.append(tKol);
        let tVr=this.napTD(this.formatBroja(proizvodKorpa.vrednost));
        f.append(tVr);

        let t3=document.createElement('td');

          function pomFun(){
            //menja kolicinu i vrednost na ekranu, i brise red ako je kolicina <=0
            tKol.innerHTML=proizvodKorpa.kolicina;
            tVr.innerHTML=that.formatBroja(proizvodKorpa.vrednost);
            if(tKol.innerHTML<=0) tr.remove();
          }

        let smanji=this.napEl('button',"-",klDu);
            smanji.addEventListener('click',function(){
                that.dodajUkorpu(proizvodi[ind],-1);
                pomFun();
                console.log(korpa);
            })
        t3.append(smanji);

        let povecaj=this.napEl('button',"+",klDu);
            povecaj.addEventListener('click',function(){
                that.dodajUkorpu(proizvodi[ind],1);
                pomFun();
                console.log(korpa);
            })
        t3.append(povecaj);

        let X=this.napEl('button',"X",klDu);
            X.addEventListener('click',function(){
                that.dodajUkorpu(proizvodi[ind],-proizvodKorpa.kolicina);
                pomFun();
                console.log(korpa);
            })
        t3.append(X);
        f.append(t3);
        tr.append(f);
        return tr;
    },
    napraviTabelu:function(korpa,proizvodi,roditelj,klS,klDu){
        for (let proizvodKorpa of korpa){
            roditelj.append(this.dodajRed(proizvodKorpa,proizvodi,klS,klDu));
        }
    },
    ukupnaVrednost:function(korpa){
        return korpa.reduce((s,c)=>s+c.vrednost,0);
    },
    upisiVrednostKorpe:function(korpa,roditelj){
        let vr=this.ukupnaVrednost(korpa);
        vr=this.formatBroja(vr);
        roditelj.append(`Укупна вредност ваше корпе је: ${vr} дин!`);
    },
    naruci:function(){
        sessionStorage.clear();
    },
    formatBroja:function(num,sep="."){
        let n=num.toString().split(sep);
        (n[1]==undefined)? n[1]=",00":(n[1].length>2)? n[1]=","+n[1].slice(0,2):(n[1].length==2)? n[1]=","+n[1]:n[1]=","+n[1]+"0";
        let l=n[0].length;
        return n[0].split("").reverse().reduce((s,c,i)=>(i%3==2 && i>0 && i!=l-1)? s+c+".":s+c,"").split("").reverse().join("")+n[1];
    },
    formatBrojaN:function(num){
        return new Intl.NumberFormat('sr-RS').format(num);
    },
    upisVrKorpeDugme:function(korpa){
        let vr=this.ukupnaVrednost(korpa);
        let vrUpis=this.formatBroja(vr);
        console.log("vrednost korpe",vr,vrUpis);
        (vr>0)? strana.dugKorpa.innerHTML=vrUpis+" дин":"КОРПА";
    },
}

let strana={
    filter: document.querySelector('nav'),
    prod: document.querySelector('.products'),
    klasProd: "item",
    klasNam: "namePr",
    klasSmPc: "smallPicure",
    klasDes1: "smallDes",
    klasProdL: "itemL",
    klasNamL: "nameL",
    klasLgPc: "largePicure",
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


