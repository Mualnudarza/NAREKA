(function(w){
  var csvDir = (function(){
    var s = document.currentScript;
    if(s && s.src){
      var idx = s.src.indexOf('assets/js/data.js');
      if(idx > -1) return s.src.slice(0, idx) + 'assets/data/';
    }
    return 'assets/data/';
  })();

  function loadCSV(file){
    try {
      var x = new XMLHttpRequest();
      x.open('GET', csvDir + file, false);
      x.send(null);
      if(x.status === 200 || x.status === 0) return parseCSV(x.responseText);
    } catch(e){ console.warn('CSV load failed:', file, e); }
    return [];
  }

  function parseCSV(t){
    var lines = t.trim().split('\n');
    if(lines.length < 2) return [];
    var h = lines[0].split(',').map(function(c){ return c.trim(); });
    var out = [];
    for(var i=1;i<lines.length;i++){
      var vals = parseLine(lines[i]);
      if(vals.length === h.length){
        var o = {};
        for(var j=0;j<h.length;j++) o[h[j]] = vals[j];
        out.push(o);
      }
    }
    return out;
  }

  function parseLine(l){
    var r=[],c='',q=false;
    for(var i=0;i<l.length;i++){
      var ch=l[i];
      if(q){ if(ch==='"'){
          if(i+1<l.length&&l[i+1]==='"'){
            c+='"';i++;
          } else q=false;
        } else c+=ch;
      } else { if(ch==='"') q=true; else if(ch===','){
          r.push(c);
          c='';
        } else c+=ch;
      }
    }
    r.push(c);
    return r;
  }

  function num(v){ var n=Number(v); return isNaN(n)?v:n; }
  function typed(name, numericFields){
    return loadCSV(name+'.csv').map(function(r){
      numericFields.forEach(function(f){
        if(f === 'area_primary_id'){ r[f] = (r[f]===''||r[f]==='null') ? null : num(r[f]); }
        else r[f] = num(r[f]);
      });
      return r;
    });
  }

  w.BRANCHES = loadCSV('branches.csv').map(function(r){ return r.name; });
  w.PACKAGES = loadCSV('packages.csv').map(function(r){ return r.name; });
  w.TEAMS = loadCSV('teams.csv').map(function(r){ return r.name; });

  w.AREA_DATA = typed('areas', ['id','is_primary','area_primary_id','customer_active','customer_isolir','customer_terminate','fasum']);
  w.AREA_TARGET = typed('area_targets', ['target','realisasi']);


  w.CUSTOMER_DATA = typed('customers', ['id']);
  w.WO_INSTALASI = typed('wo_instalasi', ['id']);
  w.WAITLIST_PSB = typed('waitlist_psb', ['id']);
  w.TEAM_MONITORING = typed('team_monitoring', []);
  w.WO_TSO = typed('wo_tso', ['id']);
  w.WAITLIST_TSO = typed('waitlist_tso', ['id']);
  w.HISTORI_TSO = typed('histori_tso', ['id']);
  w.WO_DISTRIBUTION = typed('wo_distribution', ['id']);
  w.WAITLIST_DISTRIBUTION = typed('waitlist_distribution', ['id']);
  w.WO_DISMANTLE = typed('wo_dismantle', ['id']);
  w.HISTORI_DISMANTLE = typed('histori_dismantle', ['id']);
  w.AE_DATA = typed('ae_data', []);
  w.TIM_TEKNISI_DATA = w.TEAM_MONITORING;
})(window);
