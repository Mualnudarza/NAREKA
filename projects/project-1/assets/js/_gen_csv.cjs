const fs = require("fs");
const path = require("path");

const BRANCHES = ["Temas","Bumiaji","Dau"];
const CUSTOMER_NAMES = ["Ahmad Fauzi","Budi Santoso","Rina Wijaya","Sinta Dewi","Agus Prasetyo","Maya Sari","Doni Kurniawan","Lestari Putri","Hendra Gunawan","Wulan Sari","Bayu Aditya","Citra Ayu"];
const PACKAGES = ["Home 10 Mbps","Home 20 Mbps","Home 30 Mbps","Home 50 Mbps","Bisnis 50 Mbps"];
const TEAMS = ["Team Alpha","Team Bravo","Team Charlie","Team Delta","Team Echo"];
const AE_NAMES = ["Andi Wijaya","Yusuf Bahtiar","Farida Amelia","Nia Kartika","Rahmat Hidayat","Putri Ayu","Reza Pratama","Dewi Lestari"];

const AREA_NAMES = ["PAPA","ORMO","BSUL","ETIK","LOCA","LAJA","SURA","KRBT","MABA","RITI","GADA","FABO","DAMA","LAHO","GOJO"];

function pick(arr,i){ return arr[i % arr.length]; }
function pad(n){ return n<10?"0"+n:""+n; }
function randDate(sm){ return pad(1+(sm*7)%28)+"-"+pick(["Jan","Feb","Mar","Apr","May","Jun"],sm)+"-26"; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const AREA_DATA=[];
(function(){
  const names=AREA_NAMES;
  let id=1;
  names.forEach((n,idx)=>{
    const br=pick(BRANCHES,idx), pid=id++;
    AREA_DATA.push({id:pid,branch:br,area_name:n,area_code:"AR-"+String(pid).padStart(3,"0"),is_primary:1,area_primary_id:null,open_date:randDate(idx),customer_active:40+(idx*7)%90,customer_isolir:3+(idx*3)%15,customer_terminate:(idx*2)%8,fasum:2+(idx%5)});
    AREA_DATA.push({id:id++,branch:br,area_name:n+" - Overlay",area_code:"AR-"+String(id-1).padStart(3,"0"),is_primary:0,area_primary_id:pid,open_date:randDate(idx+1),customer_active:10+(idx*4)%40,customer_isolir:1+(idx*2)%8,customer_terminate:idx%4,fasum:1+(idx%3)});
  });
})();

const AREA_TARGET = BRANCHES.map((b,i)=>({branch:b,target:6+(i%4),realisasi:AREA_DATA.filter(a=>a.branch===b&&a.is_primary===1).length+(i%3)}));

const CUSTOMER_DATA=[];
(function(){
  for(let i=0;i<60;i++){
    const br=pick(BRANCHES,i);
    const st=pick(["Aktif","Isolir","Terminate"],i%5===0?1:(i%7===0?2:0));
    CUSTOMER_DATA.push({id:i+1,branch:br,customer_name:pick(CUSTOMER_NAMES,i)+" "+(i+1),phone:"0812"+String(30000000+i*137).slice(0,8),package:pick(PACKAGES,i),pppoe_secret:"cust"+String(1000+i),subscribe_date:randDate(i%6),expired_date:randDate((i+3)%6),status:st});
  }
  for(let i=0;i<15;i++){
    const br=pick(BRANCHES,i);
    CUSTOMER_DATA.push({id:CUSTOMER_DATA.length+1,branch:br,customer_name:"Fasum "+pick(AREA_NAMES,i)+" "+(i+1),phone:"0812"+String(35000000+i*137).slice(0,8),package:pick(PACKAGES,i),pppoe_secret:"fasum"+String(100+i),subscribe_date:randDate(i%6),expired_date:randDate((i+3)%6),status:"Fasum"});
  }
})();

const WO_INSTALASI=[];
(function(){
  for(let i=0;i<25;i++){
    WO_INSTALASI.push({id:i+1,branch:pick(BRANCHES,i),pppoe_secret:"cust"+String(2000+i),customer_name:pick(CUSTOMER_NAMES,i+2)+" "+(i+1),team:pick(TEAMS,i),katim:"Katim "+pick(["Rudi","Sani","Wawan","Doni","Eko"],i),access:"P-"+(3+(i%20)),sn:"SN"+String(500000+i*17),status:pick(["Menunggu Teknisi","Dalam Proses","Selesai","Gagal Instalasi"],i)});
  }
})();

const WAITLIST_PSB=[];
(function(){
  for(let i=0;i<18;i++){
    WAITLIST_PSB.push({id:i+1,branch:pick(BRANCHES,i+2),customer_name:pick(CUSTOMER_NAMES,i+4)+" "+(i+1),customer_id:"CUST"+String(9000+i),package:pick(PACKAGES,i+1),sales:pick(AE_NAMES,i),surveyor:pick(["Bagus","Irwan","Dwi","Fitri"],i),alamat:"Jl. Merdeka No. "+(i+1)+", "+pick(BRANCHES,i+2),status:pick(["Menunggu Pembayaran","Menunggu Penjadwalan"],i)});
  }
})();

const TEAM_MONITORING=[];
(function(){
  TEAMS.forEach((t,idx)=>{ BRANCHES.forEach((b,j)=>{
    TEAM_MONITORING.push({branch:b,team_name:t+" - "+b.slice(0,3).toUpperCase(),lead_nip:"NIP"+String(70000+idx*100+j),lead_name:pick(["Rudi Hartono","Sani Wijaya","Wawan Setiawan","Doni Saputra","Eko Purnomo"],idx),lead_status:pick(["Pegawai","Training","Off"],(idx+j)%5===0?2:(idx+j)%4===0?1:0),team_status:pick(["Aktif","Non Aktif"],(idx+j)%6===0?1:0)});
  })});
})();

const WO_TSO=[];
(function(){
  for(let i=0;i<22;i++){
    WO_TSO.push({id:i+1,branch:pick(BRANCHES,i+1),type:pick(["Gangguan Koneksi","Perangkat Rusak","Redaman Tinggi","Ganti Modem"],i),pppoe_secret:"cust"+String(3000+i),customer_name:pick(CUSTOMER_NAMES,i+6)+" "+(i+1),team_katim:pick(TEAMS,i)+" / "+pick(["Rudi","Sani","Wawan"],i),access:"P-"+(3+(i%15)),status:pick(["Wait List","Penjadwalan","Dalam Proses","Selesai"],i)});
  }
})();

const WAITLIST_TSO=[];
(function(){
  for(let i=0;i<12;i++){
    WAITLIST_TSO.push({id:i+1,branch:pick(BRANCHES,i+2),pppoe_secret:"cust"+String(3500+i),customer_name:pick(CUSTOMER_NAMES,i+3)+" "+(i+1),type:pick(["Reguler","Garansi"],i),waktu_komplain:"2026-07-13 "+pad(8+i%8)+":00",waktu_eskalasi:"2026-07-13 "+pad(9+i%8)+":30",access:"P-"+(4+(i%10)),port_access:"Port "+(1+(i%8)),status:pick(["Menunggu Pembayaran","Menunggu Penjadwalan"],i)});
  }
})();

const HISTORI_TSO=[];
(function(){
  for(let i=0;i<15;i++){
    HISTORI_TSO.push({id:i+1,branch:pick(BRANCHES,i+4),customer_name:pick(CUSTOMER_NAMES,i+5)+" "+(i+1),pppoe_secret:"cust"+String(3600+i),type:pick(["Garansi","Reguler"],i),tanggal_jadwal:randDate(i%6),team_katim:pick(TEAMS,i)+" / "+pick(["Rudi","Sani","Wawan"],i),access:"P-"+(5+(i%10)),port_access:"Port "+(2+(i%8)),status:"Selesai"});
  }
})();

const WO_DISTRIBUTION=[];
(function(){
  for(let i=0;i<16;i++){
    WO_DISTRIBUTION.push({id:i+1,branch:pick(BRANCHES,i),area:"AR-"+String(1+i%10).padStart(3,"0"),type_splitter:pick(["1:8","1:16"],i),kode:"SPL-"+String(100+i),katim:"Katim "+pick(["Rudi","Sani","Wawan"],i),tanggal:randDate(i%5),phase:pick(["Instalasi","Penyambungan","Testing"],i),status:pick(["Dalam Proses","Selesai","Pending"],i)});
  }
})();

const WAITLIST_DISTRIBUTION=[];
(function(){
  const areasPerBranch = {};
  AREA_DATA.filter(a => a.is_primary === 1).forEach(area => {
    if (!areasPerBranch[area.branch]) areasPerBranch[area.branch] = [];
    areasPerBranch[area.branch].push(area.area_code);
  });

  for(let i=0;i<10;i++){
    const br = pick(BRANCHES,i);
    const area_code = pick(areasPerBranch[br], i%areasPerBranch[br].length);
    WAITLIST_DISTRIBUTION.push({id:i+1,branch:br,area:area_code,placement:"Tiang "+pick(["A","B","C"],i)+"-"+(10+i*2),type_splitter:pick(["1:8","1:16"],i),kode:"SPL-"+String(200+i)});
  }
})();

const WO_DISMANTLE=[];
(function(){
  for(let i=0;i<20;i++){
    WO_DISMANTLE.push({id:i+1,branch:pick(BRANCHES,i+3),customer_name:pick(CUSTOMER_NAMES,i+8)+" "+(i+1),pppoe_secret:"cust"+String(4000+i),phone:"0813"+String(40000000+i*211).slice(0,8),sales:pick(AE_NAMES,i),terminator:pick(["Bagus","Irwan","Dwi"],i),alamat:"Jl. Diponegoro No. "+(i+2)+", "+pick(BRANCHES,i+3),expired_date:randDate(i%6),pickup_suggestion:randDate((i+1)%6),status:pick(["Menunggu Penjadwalan","Terjadwal Hari Ini","Selesai"],i)});
  }
})();

const HISTORI_DISMANTLE=[];
(function(){
  for(let i=0;i<15;i++){
    HISTORI_DISMANTLE.push({id:i+1,branch:pick(BRANCHES,i+5),customer_name:pick(CUSTOMER_NAMES,i+10)+" "+(i+1),pppoe_secret:"cust"+String(5000+i),phone:"0813"+String(50000000+i*173).slice(0,8),sales:pick(AE_NAMES,i),terminator:pick(["Bagus","Irwan","Dwi"],i),finish_date:randDate(i%6),result:pick(["Perangkat Kembali Lengkap","Perangkat Sebagian","Tidak Ditemukan"],i%5===0?2:(i%3===0?1:0))});
  }
})();

const AE_DATA=[];
(function(){
  BRANCHES.forEach((b,idx)=>{
    const c=randInt(4,6);
    for(let j=0;j<c;j++){
      AE_DATA.push({branch:b,nip:"AE"+String(8000+idx*10+j),fullname:pick(AE_NAMES,idx+j),nickname:pick(AE_NAMES,idx+j).split(" ")[0],phone:"0821"+String(60000000+idx*97+j*13).slice(0,8),status:(idx+j)%7===0?"Non Aktif":"Aktif"});
    }
  });
})();

function toCSV(arr){
  if(!arr.length)return"";
  const keys=Object.keys(arr[0]);
  const esc=v=>{ const s=String(v??""); return s.includes(",")||s.includes('"')||s.includes("\n")?'"'+s.replace(/"/g,'""')+'"':s; };
  return keys.join(",")+"\n"+arr.map(r=>keys.map(k=>esc(r[k])).join(",")).join("\n");
}

const DATA_DIR=path.join(__dirname,"..","data");
if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR,{recursive:true});

const sets={branches:BRANCHES.map(v=>({name:v})),packages:PACKAGES.map(v=>({name:v})),teams:TEAMS.map(v=>({name:v})),areas:AREA_DATA,area_targets:AREA_TARGET,customers:CUSTOMER_DATA,wo_instalasi:WO_INSTALASI,waitlist_psb:WAITLIST_PSB,team_monitoring:TEAM_MONITORING,wo_tso:WO_TSO,waitlist_tso:WAITLIST_TSO,histori_tso:HISTORI_TSO,wo_distribution:WO_DISTRIBUTION,waitlist_distribution:WAITLIST_DISTRIBUTION,wo_dismantle:WO_DISMANTLE,histori_dismantle:HISTORI_DISMANTLE,ae_data:AE_DATA};
Object.entries(sets).forEach(([name,data])=>{
  fs.writeFileSync(path.join(DATA_DIR,name+".csv"),toCSV(data),"utf8");
  console.log("Wrote "+name+".csv ("+data.length+" rows)");
});
